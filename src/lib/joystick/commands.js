// deps
import * as utils from './utils';

//
//  JOYSTICK COMMANDS / HELPERS
//
export default function (joystick) {
    // get device interface
    const controller = joystick.device;

    // console.log('[JOYSTICK] CMDS @ ', controller);

    //
    //  check if coord position is in range
    //
    joystick.positionInRange = (position, threeshold) => {
        return (Math.abs(position) > threeshold);
    };

    //
    //  get point quadrant circle position
    //
    joystick.getQuadrant = (x, y) => {
        return utils.getQuadrant(x, y);
    };

    //
    //  get angle helper
    //
    joystick.getAngle = (x, y) => {
        return utils.getAngle(x, y);
    };

    //
    //  convert trigger position to bb8 speed factor
    //  trigger position interval:  [-1 ... 1]
    //  bb8 speed interval :        [0 ... 100]
    //
    joystick.convertPositionToSpeed = (pos) => {
        const speed = ~~((pos + 1) * 50);
        return speed;
    };
}
