// deps
import { fillArray } from '../../helpers';

//
//  GESTURE PLUGIN:
//  FLEX(ED) ARM
//
//  Whenever the Myo sends EMG events, we emit a flex_strength event
//  with a number between 0 and 1. It will also emit a arm_flex or a arm_unflex emit
//  if the flex strength passes a certain threshold.
//  This will also set a boolean, myo.isArmFlexed which you can check.
//
export default function flex(myo) {
    // get device interface
    const { device, plugins } = myo;

    // default settings
    const CONFIG = {
        threshold: 0.4, // What flex strength we considered to be 'flexed'
        timeout: 150, // Milliseconds after flexing that we send the event
        emgResolution: 10 // How many EMG datasets we use to smooth the data
    };

    // extend myo plugins
    plugins.flex = Object.assign({}, CONFIG);

    // set device flags
    device.isArmFlexed = false;

    // Emits a useful number between 0 and 1 that represents how flexed the arm is
    let emgHistory = fillArray(plugins.flex.emgResolution, fillArray(8, 0));

    // auto-activate EMG streaming ?
    myo.streamEMG(true);

    myo.on('emg', (pods) => {
        emgHistory = emgHistory.slice(1);
        emgHistory.push(pods);

        // Find the max values for each pod over the recorded history
        const maxPodValues = emgHistory.reduce((r, pod) => {
            return pod.map((podData, index) => {
                const data = Math.abs(podData);
                return (data > r[index]) ? data : r[index];
            });
        }, [0, 0, 0, 0, 0, 0, 0, 0]);

        // Find the average and then convert to between 0 and 1
        const podAvg = maxPodValues.reduce((r, d) => {
            return r + d;
        }, 0) / (8 * 128);

        // trigger flex strength event
        myo.emit('flex_strength', podAvg);
    });

    // Sets a boolean and emits events when the arm becomes flexed.
    // Uses a timeout to smooth the data a bit
    let flexTimer;
    myo.on('flex_strength', (val) => {
        if (val > plugins.flex.threshold && !device.isArmFlexed) {
            // update status flag & emit event
            device.isArmFlexed = true;
            myo.emit('arm_flex');
            // console.log('?? flex @ ', val);

            // clear timer
            clearTimeout(flexTimer);
            flexTimer = null;
        } else if (val < plugins.flex.threshold && device.isArmFlexed && !flexTimer) {
            flexTimer = setTimeout(() => {
                // update status flag & emit event
                device.isArmFlexed = false;
                myo.emit('arm_unflex');

                flexTimer = null;
            }, plugins.flex.timeout);
        }
    });
}
