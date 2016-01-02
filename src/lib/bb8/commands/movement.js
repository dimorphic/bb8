// deps
// import { Utils } from 'cylon';

// helpers
// const { every, after } = Utils;

//
//  BB8 COMMANDS
//
export default function (bb8) {
    // get device interface
    const { device } = bb8;

    //
    //  MOVE / ROLL
    //
    bb8.move = (speed = bb8.speed, heading, state = null, callback = null) => {
        console.log('[BB8] Move @ ', speed, heading);

        // @TODO: add orb speed
        device.roll(speed, heading, state, callback);
    };

    //
    //   STOP
    //
    bb8.stop = () => {
        console.log('[BB8] Stop movement');
        device.stop();
    };

    //
    //  SET MOVEMENT SPEED
    //
    bb8.setSpeed = (factor) => {
        bb8.speed = factor;
        // @TODO
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
        bb8.orientation = heading; // @TODO: refactor to setHeading()?
        // device.heading = heading; // @TODO: double check this
        device.roll(0, heading, 0); // turn in place?
    };

    //
    //  THROTTLED MOVEMENT
    //
    // @TODO
}
