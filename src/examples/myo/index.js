// deps
import BB8 from '../../lib/bb8';
import Myo from '../../lib/myo';
import { respawnMe } from '../../lib/helpers';
import { throttle } from 'lodash';

// BB8 device uuid
import { DEVICE_UUID } from '../../config';

// MYO FORCE handlers & commands
import handlers from './handlers';
import commands from './commands';

//
//  Create Myo & BB8 droid
//
const hand = new Myo({ autoConnect: true });
const droid = new BB8({ uuid: DEVICE_UUID, autoConnect: true });

const HANDLERS = handlers(droid, hand);
const COMMANDS = commands(droid, hand);

// DROID (RE)BOOT / RESPAWNER
HANDLERS.addGestures({
    'hard_tap': throttle(() => {
        console.log('I GO DIE NOW!');
        // toggleGestureControls();

        // @HACK
        // droid.reconnect() doesn't work for now. need FIX
        // respawnMe();
    }, 5000)
});

//
//  USER GESTURES
//
const USER_GESTURES = {
    'flex_strength': HANDLERS.handleTheForce,

    'snap': COMMANDS.randomColor,
    'pose': COMMANDS.handleForcePose
};

// DROID on connect
droid.on('connect', () => {
    // visual signal connect
    const spin = droid.colorSpin(100);
    droid.turn(~~(Math.random() * 360));
    setTimeout(() => { clearInterval(spin); }, 1000);

    // always listen to gestures, don't wait for unlock?
    hand.connector.setLockingPolicy('none');

    // activate myo gesture controls
    toggleGestureControls(true);
});

//
// toggle user gesture controls
//
function toggleGestureControls(toggle = !droid.userControl) {
    if (!hand.device.locked && hand.device.isArmFlexed) {
        return void 0;
    }

    if (toggle) {
        HANDLERS.addGestures(USER_GESTURES);
        console.log('[BB8] Enabled user gestures. Go nuts!');
    } else {
        HANDLERS.removeGestures(USER_GESTURES);
        console.log('[BB8] Disabled user gestures');
    }

    // toggle control flag
    droid.userControl = toggle;
}

// plugins debug
// hand.on('vector', throttle((data) => {
//     console.log('\n\n!!!! vector @ ', inspect(data));
// }, 400));
// hand.on('snap', () => { console.log('!!!! FINGERS SNAP BRO !'); });
// hand.on('arm_busy', () => { console.log('!!!! arm_busy !'); });
// hand.on('arm_rest', () => { console.log('!!!! arm_rest !'); });
// hand.on('tap', () => { console.log('!!!! tap !'); });
// hand.on('hard_tap', () => { console.log('!!!! HARD TAP !'); });

// hand.on('arm_flex', () => { console.log('!!!! FLEX!'); });
// hand.on('arm_unflex', () => { console.log('!!!! UNFLEX!'); });
// hand.on('flex_strength', (val) => { console.log('!!!! FLEX STRENGTH @ ', val); });

// lock status
// hand.on('unlocked', () => { console.log('hand active!'); });
// hand.on('locked', () => { console.log('hand locked!'); });
