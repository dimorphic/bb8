// deps
import { inspect } from '../../../helpers'; // @DEBUG
import { Utils } from 'cylon';

// helpers
const { every } = Utils;

//
//  BB8 CORE / COMMON COMMANDS
//
export default function (bb8) {
    // get device interface
    const { device } = bb8;

    //
    //  DEBUG BLUETOOTH INFO
    //
    bb8.debug = () => {
        device.getBluetoothInfo((err, data) => {
            if (err) {
                console.log('error: ', err);
            } else {
                console.log('data:', data);
            }
        });
    };

    //
    //  OPTION FLAGS
    //
    bb8.getFlags = () => {
        device.getPermOptionFlags((err, data) => {
            console.log('!!!! GET PERM OPTION FLAG @ ');
            console.log(err || inspect(data));
        });

        device.getTempOptionFlags((err, data) => {
            console.log('!!!! GET TEMP OPTION FLAG @ ');
            console.log(err || inspect(data));
        });
    };

    //
    //  SET PERMANENT FLAGS
    //
    //   * - `0`: Set to prevent Sphero from immediately going to sleep when placed in
    //   *   the charger and connected over Bluetooth.
    //   * - `1`: Set to enable Vector Drive, that is, when Sphero is stopped and
    //   *   a new roll command is issued it achieves the heading before moving along
    //   *   it.
    //   * - `2`: Set to disable self-leveling when Sphero is inserted into the
    //   *   charger.
    //   * - `3`: Set to force the tail LED always on.
    //   * - `4`: Set to enable motion timeouts (see DID 02h, CID 34h)
    //   * - `5`: Set to enable retail Demo Mode (when placed in the charger, ball
    //   *   runs a slow rainbow macro for 60 minutes and then goes to sleep).
    //   * - `6`: Set double tap awake sensitivity to Light
    //   * - `7`: Set double tap awake sensitivity to Heavy
    //   * - `8`: Enable gyro max async message (NOT SUPPORTED IN VERSION 1.47)
    //   * - `6-31`: Unassigned
    //
    bb8.setPermFlags = (flags = null, callback = null) => {
        // do it
        device.setPermOptionFlags(flags, callback);
    };

    bb8.setTempFlags = (flags = null, callback = null) => {
        // do it
        device.setTempOptionFlags(flags, callback);
    };

    //
    //  COMMANDS QUE
    //
    bb8.debugQue = () => {
        every(500, () => {
            console.log('[BB8] CMDs que @ ', device.commandQueue);
        });
    };
}
