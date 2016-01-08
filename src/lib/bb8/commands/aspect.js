// deps
import { Utils } from 'cylon';
import tinycolor from 'tinycolor2';
import { COLORS, getHumanColor } from '../colors';

// helpers
const { every } = Utils;

//
//  BB8 ASPECT / LOOKS COMMANDS
//
export default function (bb8) {
    // get device interface
    const { device } = bb8;

    //
    //  GET CURRENT COLOR
    //
    bb8.getCurrentColor = (callback) => {
        // get orb current color (if any, default 0x000000)
        device.getColor((err, data) => {
            if (err) {
                throw new Error('Can\'t get device color. Check device connection. ', err);
            }

            // spread color data
            const { red, green, blue } = data;

            // get hex from RGB
            const color = tinycolor({ r: red, g: green, b: blue }).toHexString();

            // issue callback
            if (typeof callback === 'function') { callback(color); }
        });
    };

    //
    //  SET COLOR
    //
    bb8.setColor = (color) => {
        console.log('[BB8] Set color @ ', color);
        device.color(color);
    };

    //
    //  SET RANDOM COLOR
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

    bb8.colorSpinHue = (startColor) => {
        const base = startColor || getHumanColor().hex;
        const MAX_SPIN = 360;
        let degress = 0;
        let index = 1;

        return every((16).ms(), () => {
            degress = degress + index;

            // spin color
            const randColor = tinycolor(base).spin(degress).toString();

            // set droid color
            bb8.setColor(randColor);

            // reverse spin direction
            if (degress > MAX_SPIN) {
                index = -1;
            } else if (degress < 0) {
                index = 1;
            }
        });
    };
}
