// deps
import CONSTANTS from '../constants';

// @DEBUG
// import { inspect } from '../helpers';

//
//  Myo COMMANDS
//
export default function (myo) {
    const { device } = myo;
    const { COMMANDS } = CONSTANTS.MYO;

    // bind commands
    COMMANDS.forEach((command) => {
        if (!device[command]) { return void 0; }

        // proxy methods to our device
        myo[command] = device[command].bind(device);
    });
}
