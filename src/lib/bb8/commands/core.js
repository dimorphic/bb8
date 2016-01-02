// deps

// BB8 utils
import * as utils from '../utils';

//
//  BB8 CORE / COMMON COMMANDS
//
export default function (bb8) {
    // get device interface
    const { device } = bb8;

    //
    //  COMMAND THROTTLER
    //
    // @TODO
    // bb8.throttle = (cb, minDuration) => {};

    //
    //  GET ANGLE HELPER
    //
    bb8.getAngle = (x, y) => {
        return utils.getBBAngle(x, y);
    };

    //
    //  CALIBRATION TOGGLER
    //
    bb8.toggleCalibration = (flag = false) => {
        if (flag) {
            console.log('[BB8] ::START CALIBRATION::');

            // start calibration / disable stabilization
            device.startCalibration();

            // set flag
            bb8.isCalibrating = true;
        } else {
            console.log('[BB8] ::FINISH CALIBRATION::');

            // finish calibration / enable stabilization
            device.finishCalibration();

            // set flag
            bb8.isCalibrating = false;
        }
    };
}
