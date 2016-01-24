//
//  GESTURE PLUGIN:
//  HARD TAP
//
//  emit a hard_tap event when the user physically taps the main pod of the Myo
//  in quick sucession. If you are also using the Busy Arm Plugin,
//  it will improve the false positives by making sure the arm is at rest while tapping
//
export default function hartap(myo) {
    // get device interface
    const { device, plugins } = myo;

    // default settings
    const CONFIG = {
        threshold: 0.9, // how much force is required to register a tap
        time_window: [80, 300] // the window in milliseconds for a hard tap to register
    };

    // extend myo plugins
    plugins.hardtap = Object.assign({}, CONFIG);

    // set device flags
    device.isTapped = false;
    device.lastTapTimestamp = null;

    // listen to accelerometer
    myo.on('accelerometer', (data) => {
        const last = device.lastIMU.accelerometer;
        const delta = Math.abs(Math.abs(last.y) - Math.abs(data.y)) + Math.abs(Math.abs(last.z) - Math.abs(data.z));

        if (delta > plugins.hardtap.threshold) {
            const timeDiff = new Date().getTime() - (device.lastTapTimestamp || 0);
            const [timeWindowMin, timeWindowMax] = plugins.hardtap.time_window;
            const withinWindow = timeDiff > timeWindowMin && timeDiff < timeWindowMax;

            if (!device.isTapped) {
                myo.emit('tap');
                device.isTapped = true;
            }

            if (withinWindow && !device.isArmBusy) {
                myo.emit('hard_tap');
            }

            // save last timestamp
            device.lastTapTimestamp = new Date().getTime();
        } else {
            device.isTapped = false;
        }
    });
}
