// deps
import BB8 from './lib/bb8';
import Joystick from './lib/joystick';
import { throttle } from 'lodash';

// @DEBUG
import { inspect } from './helpers';

// device uuid
import { DEVICE_UUID } from './config';

const INTERACTIVE = true;

//
//  Create xbox & droid
//
const droid = new BB8({ uuid: DEVICE_UUID, autoConnect: false });

const xbox = new Joystick({ autoConnect: true });

// @TODO: move these
const STICK_THREESHOLD = 0.3; // minimum stick movement threeshold to act
const BLUETOOTH_THROTTLE = 100;

// move droid helper
const moveDroid = (angle) => { droid.move(droid.speed, angle, () => {}); };
const turnDroid = (angle) => { droid.turn(angle); };

// throttled move & turn commands
const throttleMove = throttle(moveDroid, BLUETOOTH_THROTTLE);
const throttleTurn = throttle(turnDroid, BLUETOOTH_THROTTLE);

function activateControls() {
    console.log('Activating joystick...');

    //
    // color controls
    //
    xbox.on('button:press', (button) => {
        // console.log('button @ ', button);

        const BUTTONS = {
            'x': 'blue',
            'y': 'yellow',
            'b': 'red',
            'a': 'green'
        };

        // abort if no color
        if (!BUTTONS[button]) { return void 0; }

        // set droid color
        // console.log('droid new color @ ', BUTTONS[button]);
        droid.color(BUTTONS[button]);
    });

    //
    //  movement control
    //
    xbox.on('stick:move', (stick, pos) => {
        const stickSide = xbox.getStickSide(stick);

        // LEFT stick only
        if (stickSide !== 'left') { return void 0; }

        const isCalibrating = droid.isCalibrating;
        const inRange = xbox.positionInRange(pos, STICK_THREESHOLD);

        if (inRange && !isCalibrating) {
            const position = xbox.getStick(stickSide);
            const bb8Angle = ~~(droid.getAngle(position.x, position.y));

            // @TODO: add stick movement speed velocity, for fine control?

            // move droid to
            throttleMove(bb8Angle);
            // throttleTurn(bb8Angle);
        }
    });

    //
    //  triggers
    //
    xbox.on('trigger:move', (trigger, pos) => {
        // emergency stop
        if (trigger === 'lt') {
            droid.stop();
        } else if (trigger === 'rt') {
            const speed = xbox.convertPositionToSpeed(pos);
            // console.log('\n\nXBOX TRIGGER ', trigger, ' @ ', pos, speed);
            droid.setSpeed(speed);
        }
    });

    //
    //  DROID calibration
    //
    xbox.on('select:press', () => {
        // console.log('[DROID] CALIBRATE');
        droid.toggleCalibration(!droid.isCalibrating);
    });

    //
    //  calibration control
    //  attach events on right stick X axis
    //
    xbox.on('right_x:move', (pos) => {
        const isCalibrating = droid.isCalibrating;
        const inRange = xbox.positionInRange(pos, STICK_THREESHOLD);

        //  [ -1 ... 0 ... 1 ]
        //  [ ]
        if (isCalibrating && inRange) {
            // const angle = droid.getAngle(pos, 0);
            const angle = Math.asin(pos) * (180 / Math.PI);

            // console.log('\n\n!!!!!! rotate @ ', angle);
            throttleTurn(angle);
        }
    });

    //
    //  color spin
    //
    xbox.on('rb:press', () => {
        // droid.colorSpin();
        droid.debugFlags();
    });

    // ping
    xbox.on('lb:press', () => {
        console.log('Pinging droid...');
        droid.device.ping((err, data) => {
            console.log('Droid pong!');
            console.log(err || inspect(data));
        });
    });
}

//
//  @DEBUG: JOYSTICK
//
droid.connect();

//
//  CONNECT / DISCONNECT (RECONNECT) controls
//
xbox.on('start:press', () => {
    // console.log('Trying to reconnect...');
    droid.reconnect();
    // droid.connect();
});

// activateControls();

//
//  DROID BINDS
//
droid.on('connect', () => {
    console.log('deathstar online! ');

    // droid.debug();
    // droid.debugQue();

    // activate joystick controls
    activateControls();

    // droid.move(2, 30);
    // throttleTurn(180);
});

droid.on('disconnect', () => {
    console.log('deathstar offline!');
});

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
