// deps
import BB8 from './lib/bb8';
import Joystick from './lib/joystick';

// device uuid
import { DEVICE_UUID } from './config';
import commands from './lib/commands';

// @DEBUG
import { inspect } from './helpers';

// @TODO: add process respawner? split to droid worker?
const INTERACTIVE = true;

//
//  Create xbox & droid
//
const droid = new BB8({ uuid: DEVICE_UUID, autoConnect: false });
const xbox = new Joystick({ autoConnect: true });
const HANDLERS = commands(droid, xbox);

//  DROID reconnect
xbox.on('start:press', () => { droid.reconnect(); });

// DROID on connect
droid.on('connect', () => {
    // droid.debug();
    // droid.debugQue();

    // activate joystick controls
    activateControls();
});

function activateControls() {
    console.log('Activating joystick...');

    // color controls
    xbox.on('button:press', HANDLERS.controlColor);

    // sticks: movement / calibration
    xbox.on('stick:move', HANDLERS.handleSticks);

    //  triggers: speed
    xbox.on('trigger:move', HANDLERS.handleTriggers);

    //  toggle calibration
    xbox.on('select:press', droid.toggleCalibration);

    // ping
    xbox.on('lb:press', () => {
        console.log('Pinging droid...');
        droid.device.ping((err, data) => {
            console.log('Droid pong!');
            console.log(err || inspect(data));
        });
    });

    // @DEBUG
    xbox.on('rb:press', () => {
        // droid.colorSpin();
        droid.debugFlags();
    });
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
