//
//  HANDLERS
//  to control BB8 via Myo bracelet
//
export default function (droid, myo) {
    const HANDLERS = {};

    //
    //  ADD GESTURE(S) CONTROLS
    //
    HANDLERS.addGestures = (gestures) => {
        const EVENTS = Object.keys(gestures);

        EVENTS.forEach((event) => {
            myo.on(event, gestures[event]);
        });
    };

    //
    //  REMOVE GESTURE(S) CONTROLS
    //
    HANDLERS.removeGestures = (gestures) => {
        const EVENTS = Object.keys(gestures);

        EVENTS.forEach((event) => {
            myo.removeListener(event, gestures[event]);
        });
    };

    //
    //  HANDLE EMG / THE FORCE !
    //
    HANDLERS.handleTheForce = (flexForce) => {
        const FORCE_THRESHOLD = 0.1;

        // is The Force strong enough in this one?
        const isForceStrong = (Math.abs(flexForce) > FORCE_THRESHOLD);
        if (!isForceStrong) { return void 0; }

        // ...it is! do black magic!
        const force = flexForce.toFixed(4);
        const speed = convertForceToSpeed(force);

        // emit Force Push!
        myo.emit('force_push', { force, speed });
    };

    //
    //  convert Myo EMG (THE FORCE!) to BB8 speed factor
    //  emg data interval:      [0 ... 1]
    //  bb8 speed interval :    [0 ... 100]
    //
    function convertForceToSpeed(force) {
        const SPEED_MULTIPLIER = 100;

        let speed = ~~(force * SPEED_MULTIPLIER); // make it easier
        if (speed > 100) { speed = 100; } // normalize

        return speed;
    }

    // expose
    return HANDLERS;
}
