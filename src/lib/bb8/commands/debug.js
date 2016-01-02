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
    bb8.debugFlags = () => {
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
    //  COMMANDS QUE
    //
    bb8.debugQue = () => {
        every(500, () => {
            console.log('[BB8] CMDs que @ ', device.commandQueue);
        });
    };
}
