// deps
import BB8 from './lib/bb8';
import Joystick from './lib/joystick';
import { respawnMe } from './lib/helpers';

// device uuid
import { DEVICE_UUID } from './config';
import commands from './commands';

//
//  Create xbox & droid
//
const xbox = new Joystick({ autoConnect: true });
const droid = new BB8({ uuid: DEVICE_UUID, autoConnect: true }); // @TODO

const HANDLERS = commands(droid, xbox);
let CONTROLS_LISTENERS = [];

// DROID (RE)BOOT / RESPAWNER
HANDLERS.addControls({
    'home:press': () => {
        console.log('I GO DIE NOW!');
        toggleControls();

        // @HACK
        // droid.reconnect() doesn't work for now. need FIX
        respawnMe();
    }
});

//
//  USER CONTROLS
//  can be toggled on/off
//
const USER_CONTROLS = {
    'stick:move': HANDLERS.handleSticks,
    'trigger:move': HANDLERS.handleTriggers,
    'button:press': HANDLERS.controlColor,

    'select:press': droid.toggleCalibration,
    'rb:press': () => { droid.getFlags(); },
    'lb:press': droid.toggleDriveMode
};

// DROID on connect
droid.on('connect', () => {
    // add commands toggler
    HANDLERS.addControls({ 'start:press': toggleControls });

    // activate joystick controls
    toggleControls();
});

//
// toggle user commands / controls helper
//
function toggleControls() {
    if (!droid.userControl) {
        CONTROLS_LISTENERS = HANDLERS.addControls(USER_CONTROLS);
        console.log('[BB8] Enabled user control. Go nuts!');
    } else {
        HANDLERS.removeControls(CONTROLS_LISTENERS);
        console.log('[BB8] Disabled user controls');
    }

    // toggle control flag
    droid.userControl = !droid.userControl;
}
