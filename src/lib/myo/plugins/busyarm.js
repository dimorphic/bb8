//
//  GESTURE PLUGIN:
//  BUSY ARM
//
//  will emit a arm_busy event when the arm becomes busy and a arm_rest event
//  when the arm is at rest. The variable myo.isArmBusy is a boolean
//  that tracks what state the arm is in.
//
export default function busyarm(myo) {
// module.exports = function busyarm(myo) {
    // get device interface
    const { device, plugins } = myo;

    // default settings
    const CONFIG = {
        threshold: 80, // The threshold the EMA has to pass to be considered busy
        ema_alpha: 0.05 // The coefficient for smoothing the EMA of the gyro data
    };

    // extend myo plugins
    plugins.busyarm = Object.assign({}, CONFIG);

    // set device flags
    device.isArmBusy = false;
    device.armBusyData = null;

    // @TODO
    // plugins.busyarm.enable = () => {};
    // plugins.busyarm.disable = () => {};

    // listen to gyroscope
    myo.on('gyroscope', (gyro) => {
        device.armBusyData = device.armBusyData || 0;

        // Calculate the exponential moving average of the abs values from the gyro
        const ema = device.armBusyData +
        plugins.busyarm.ema_alpha * (Math.abs(gyro.x) + Math.abs(gyro.y) + Math.abs(gyro.z) - device.armBusyData);

        // If that's over the specific threshold, the arm is considered busy
        const isBusy = ema > plugins.busyarm.threshold;

        // If the busy state has changed, emit the event
        if (isBusy !== device.isArmBusy) {
            myo.emit(isBusy ? 'arm_busy' : 'arm_rest');
            device.isArmBusy = isBusy;
        }

        // Save the accumulator on the myo instance for the EMA
        device.armBusyData = ema;
    });
}
