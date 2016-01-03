// deps
import { Utils } from 'cylon';
// import { colors } from '../colors';

// helpers
const { every } = Utils;

//
//  BB8 ASPECT / LOOKS COMMANDS
//
export default function (bb8) {
    // get device interface
    const { device } = bb8;

    //
    //  COLOR
    //
    bb8.color = (color) => {
        device.color(color);
    };

    //
    //  RANDOM COLOR
    //
    bb8.randomColor = () => {
        device.randomColor();
    };

    //
    //  FUN ACTIONS
    //
    bb8.colorSpin = (interval = 500) => {
        return every(interval, () => {
            bb8.randomColor();
        });
    };

    /*
    // @TODO
    bb8.colorSpinHue = (base) => {
        const MAX_SPIN = 360;

        let degress = 0;
        let index = 1;

        every((16).ms(), () => {
            degress = degress + index;

            const randColor = tinycolor(base).spin(degress).toString();
            console.log('!! new color: ', randColor);

            orb.color(randColor);

            if (degress > MAX_SPIN) {
                index = -1;
            } else if (degress < 0) {
                index = 1;
            }
        });
    };
    */
}
