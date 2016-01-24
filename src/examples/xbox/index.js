// deps
import BB8 from '../../lib/bb8';
import Joystick from '../../lib/joystick';
import { respawnMe } from '../../lib/helpers';

// device uuid
import { DEVICE_UUID } from '../../config';

// XBOX FORCE handlers & commands
import handlers from './handlers';
import commands from './commands';

//
//  Create xbox & BB8 droid
//
const xbox = new Joystick({ autoConnect: true });
const droid = new BB8({ uuid: DEVICE_UUID, autoConnect: true });

const HANDLERS = handlers(droid, xbox);
const COMMANDS = commands(droid, xbox);

//
//  FAILSAFE
//  DROID (RE)BOOT / RESPAWNER
//
HANDLERS.addControls({
    'home:press': () => {
        toggleControls(false);
        respawnMe(); // @HACK: droid.reconnect() doesn't work for now. need FIX
    }
});

//
//  USER CONTROLS
//  can be toggled on/off
//
const USER_CONTROLS = {
    'stick:move': COMMANDS.handleSticks,
    'trigger:move': COMMANDS.handleTriggers,
    'button:press': COMMANDS.controlColor,

    'select:press': droid.toggleCalibration,
    'rb:press': () => { droid.getFlags(); },
    'lb:press': droid.toggleDriveMode
};

// DROID on connect
droid.on('connect', () => {
    // add commands toggler
    HANDLERS.addControls({ 'start:press': toggleControls });

    // visual signal connect
    const spin = droid.colorSpin(100);
    droid.turn(~~(Math.random() * 360));
    setTimeout(() => { clearInterval(spin); }, 1000);

    // activate joystick controls
    toggleControls(true);
});

//
// toggle user commands / controls helper
//
function toggleControls(toggle = !droid.userControl) {
    if (toggle) {
        HANDLERS.addControls(USER_CONTROLS);
        console.log('[BB8] Enabled user control. Go nuts!');
    } else {
        HANDLERS.removeControls(USER_CONTROLS);
        console.log('[BB8] Disabled user controls');
    }

    // toggle control flag
    droid.userControl = toggle;
}
