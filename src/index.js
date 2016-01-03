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
const droid = new BB8({ uuid: DEVICE_UUID, autoConnect: true }); // @TODO
const xbox = new Joystick({ autoConnect: true });

const HANDLERS = commands(droid, xbox);

// CONTROLS MAP
const CONTROLS = {
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

let CONTROLS_LISTENERS = [];

let HAS_CONTROL = false;

//  DROID reconnect
HANDLERS.addControls({
    'start:press': () => {
        if (HAS_CONTROL) {
            HANDLERS.removeControls(CONTROLS_LISTENERS);
            CONTROLS_LISTENERS = [];
        } else {
            CONTROLS_LISTENERS = HANDLERS.addControls(CONTROLS);
        }

        HAS_CONTROL = !HAS_CONTROL;
    }
});

// DROID on connect
droid.on('connect', () => {
    // activate joystick controls
    console.log('[BB8] Activating controls...');

    // add / bind controls
    CONTROLS_LISTENERS = HANDLERS.addControls(CONTROLS);
    HAS_CONTROL = true;
});

function disableControls() {
    // @TODO?
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
