// deps
import BB8 from './lib/bb8';
import Joystick from './lib/joystick';

// device uuid
import { DEVICE_UUID } from './config';
import commands from './commands';

// @DEBUG
import { inspect } from './helpers';

// @TODO: add process respawner? split to droid worker?
const INTERACTIVE = true;

//
//  Create xbox & droid
//
const xbox = new Joystick({ autoConnect: true });
const droid = new BB8({ uuid: DEVICE_UUID, autoConnect: true }); // @TODO
const HANDLERS = commands(droid, xbox);

// DROID (RE)BOOT / RESPAWNER
HANDLERS.addControls({
    'home:press': () => {
        // console.log('home bttn! respawn droid worker?');
        droid.reconnect();
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
    'rb:press': droid.debugFlags,
    'lb:press': () => {
        console.log('Pinging droid...');
        droid.device.ping((err, data) => {
            console.log('Droid pong!');
            console.log(err || inspect(data));
        });
    }
};

// DROID on connect
droid.on('connect', () => {
    console.log('!!!! DROID CONNECT');

    // add commands toggler
    HANDLERS.addControls({ 'start:press': toggleControls });

    // activate joystick controls
    toggleControls();
});

//
// toggle user commands / controls helper
//
let CONTROLS_LISTENERS = [];
function toggleControls() {
    console.log('toggle ctrls');

    if (!droid.userControl) {
        console.log('[BB8] Enabled user control. Go nuts!');
        CONTROLS_LISTENERS = HANDLERS.addControls(USER_CONTROLS);
    } else {
        console.log('[BB8] Disabled user controls');
        HANDLERS.removeControls(CONTROLS_LISTENERS);
    }

    // toggle control flag
    droid.userControl = !droid.userControl;
}

// interactive CLI
if (INTERACTIVE) {
    process.stdin.setEncoding('utf8'); // prolly at top of file/module?

    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
            // process.stdout.write('data: ' + chunk);
            console.log('console chunk @ ', chunk);
        }
    });

    process.stdin.on('end', () => { process.stdout.write('end'); });
    process.on('exit', (code) => { console.log('process exit!', code); });
}
