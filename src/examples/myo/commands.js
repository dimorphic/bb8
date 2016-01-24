// deps
import { throttle } from 'lodash';
import tinycolor from 'tinycolor2';

//
//  COMMANDS and HANDLERS
//  to control BB8 via Myo
//
export default function (droid, myo) {
    // magic powers
    const COMMANDS = {};

    //
    //  FORCE POSES!
    //  YOU STRONG ENOUGH, BRO?
    //
    COMMANDS.handleForcePose = (pose) => {
        switch (pose) {
            // FORCE TURN
            case 'fist':
                COMMANDS.toggleForceTurn(true);
                break;
            case 'fist_off':
                COMMANDS.toggleForceTurn(false);
                break;

            // FORCE PUSH
            case 'fingers_spread':
                COMMANDS.toggleForcePush(true);
                break;
            case 'fingers_spread_off':
                COMMANDS.toggleForcePush(false);
                break;

            default:
                break;
        }
    };

    //
    //  FORCE PUSH toggler
    //
    COMMANDS.toggleForcePush = (toggle) => {
        if (toggle) {
            console.log('[FORCE] Activate Force Push!');

            // set zero orientation where hand is facing
            myo.zeroOrientation();

            // activate force_push stream & orientation
            myo.on('force_push', COMMANDS.controlMovement);
            myo.on('vector', COMMANDS.controlOrientation);
        } else {
            console.log('[FORCE] Deactivate Force Push!');

            // deactivate force_push stream & orientation
            myo.removeListener('force_push', COMMANDS.controlMovement);
            myo.removeListener('vector', COMMANDS.controlOrientation);

            // stop droid
            droid.throttleStop();
        }
    };

    //
    //  FORCE TURN toggler
    //
    COMMANDS.toggleForceTurn = (toggle) => {
        if (toggle) {
            console.log('[FORCE] Activate Force Turn!');

            // set zero orientation where hand is facing
            myo.zeroOrientation();

            // stop droid
            droid.throttleStop();
            droid.toggleCalibration(true);

            // activate vector stream
            myo.on('vector', COMMANDS.controlCalibration);
        } else {
            console.log('[FORCE] Deactivate Force Turn!');

            // deactivate vector stream
            myo.removeListener('vector', COMMANDS.controlCalibration);

            // stop droid calibration, turn on stabilization
            droid.toggleCalibration(false);
        }
    };

    //
    //  MOVEMENT CONTROL
    //
    COMMANDS.controlMovement = (forcePush) => {
        const { speed } = forcePush;

        // move it!
        droid.setSpeed(speed);
        droid.throttleMove();
        // console.log('droid speed @ ', speed);
    };

    COMMANDS.controlOrientation = (vector) => {
        const { theta } = vector;
        const angle = getDroidAngle(theta);

        // update orientation pointer
        droid.orientation = angle;
    };

    COMMANDS.controlCalibration = throttle((vector) => {
        const { theta } = vector;
        const angle = getDroidAngle(theta);

        // turn droid!
        droid.throttleTurn(angle);
    }, 100);

    //
    //  COLOR CONTROL
    //
    COMMANDS.randomColor = () => {
        droid.randomColor();
    };

    COMMANDS.controlColor = (vector) => {
        const { theta } = vector;
        const angle = getDroidAngle(theta);

        const base = droid.color || 0x008000;

        // spin color
        const randColor = tinycolor(base).spin(angle).toString();

        // set droid color
        droid.setColor(randColor);
    };

    function getDroidAngle(theta) {
        const degree = ~~(-(theta * 180));
        const angle = (Math.sign(degree) === -1) ? (360 + degree) : degree;

        return angle;
    }

    // expose
    return COMMANDS;
}
