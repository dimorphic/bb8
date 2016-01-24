// deps
import { fillArray } from '../../helpers';

//
//  GESTURE PLUGIN:
//  FINGERS SNAP
//
//  emit a snap event whenever you snap your fingers.
//  It's uses the accelerometer to detect very specific reverbreations in your arm
//  when you snap. It then filters these against your arms muscle activity to
//  reduce false positives from your arm being bumped.
//
//  Note: Works best if your arm isn't resting on anything and
//  you have a nice strong snap!
//
export default function snap(myo) {
    // get device interface
    const { device, plugins } = myo;

    if (!plugins.flex) {
        throw new Error('[MYO] snap.plugin requires flex.plugin');
    }

    // default settings
    const CONFIG = {
        max: 2.8,
        min: 0.122070312,
        blip_threshold: -0.1098632808
    };

    // extend myo plugins
    plugins.snap = Object.assign({}, CONFIG);

    // create clear history
    const clearHistory = fillArray(20, { x: 0, y: 0, z: 0 });

    // create fresh history snapshot
    let snapHistory = clearHistory.slice(); // short copy!

    // listen to device accelerometer
    myo.on('accelerometer', (data) => {
        const blips = { x: 0, y: 0, z: 0 };
        const max = { x: data.x, y: data.y, z: data.z };
        const min = { x: data.x, y: data.y, z: data.z };

        // update snapHistory
        snapHistory.push(data);
        // snapHistory[snapHistory.length] = data; // might be faster?
        snapHistory = snapHistory.slice(1);

        // console.log('history @ ', snapHistory);

        // Analyze the last bit of accelerometer history for blips on each axis
        for (let i = 1; i < snapHistory.length - 1; i++) {
            const prev = snapHistory[i + 1];
            const current = snapHistory[i];
            const next = snapHistory[i - 1];

            /* eslint-disable no-loop-func */
            ['x', 'y', 'z'].forEach((axis) => {
                if ((current[axis] - prev[axis]) * (next[axis] - current[axis]) < plugins.snap.blip_threshold) {
                    blips[axis]++;
                }
                if (current[axis] > max[axis]) max[axis] = current[axis];
                if (current[axis] < min[axis]) min[axis] = current[axis];
            });
        }

        // Snapping creates certain 'blips' with reverberations on each axis. Checking them here.
        const hasBlip = (blips.x > 0 && blips.y > 2) || (blips.x + blips.y + blips.z > 4);

        // All peaks must be with the thresholds
        const withinThresholds = ['x', 'y', 'z'].reduce((r, axis) => {
            const peakDiff = max[axis] - min[axis];
            return r && peakDiff >= plugins.snap.min && peakDiff <= plugins.snap.max;
        }, true);

        // within range / checks ?
        if (hasBlip && withinThresholds && device.isArmFlexed) {
            // emit event
            myo.emit('snap');

            // refresh history snapshot
            snapHistory = clearHistory.slice();
        }
    });
}
