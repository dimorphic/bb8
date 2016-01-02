// deps
import { throttle } from 'lodash';

//
//  BB8 COMMANDS
//
export default function (bb8) {
    // get device interface
    const { device } = bb8;

    // due to some sphero limitations,
    // it's better to throttle delay and not spam skill BB8 droid
    const { BLUETOOTH_THROTTLE_DELAY } = bb8.config;

    //
    //  SET MOVEMENT SPEED
    //
    bb8.setSpeed = (factor) => {
        bb8.speed = factor;
        // @TODO
    };

    //
    //   STOP
    //
    bb8.stop = () => {
        console.log('[BB8] Stop movement');
        device.stop();
    };

    //
    //  MOVE / ROLL
    //
    bb8.move = (speed = bb8.speed, heading = bb8.orientation, state = 0, callback = null) => {
        console.log('[BB8] Move @ ', speed, heading);
        device.roll(speed, heading, state, callback);
    };

    //
    //  TURN
    //
    bb8.turn = (heading) => {
        if (bb8.orientation === heading) { return void 0; }

        console.log('[BB8] Setting new course @ ', heading);

        // @TODO: add device rotation rate/speed fine control
        // device.setRotationRate(0-255, cb);

        // set new heading
        // bb8.orientation = heading; // @TODO: refactor to setHeading()?
        // device.heading = heading; // @TODO: double check this
        device.roll(0, heading, 0); // turn in place?
    };

    //
    //  THROTTLED MOVEMENT / TURN helpers
    //
    bb8.throttleMove = throttle(() => {
        // console.log('throttle movement');
        bb8.move(bb8.speed, bb8.orientation, () => {});
    }, BLUETOOTH_THROTTLE_DELAY);

    bb8.throttleTurn = throttle((angle) => {
        // console.log('throttle turn @ ', angle);
        bb8.turn(angle);
    }, BLUETOOTH_THROTTLE_DELAY);
}
