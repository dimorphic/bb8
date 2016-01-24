// deps
import { roll, pitch, yaw } from '../utils';

//
//  GESTURE PLUGIN:
//  ROTATIONAL VECTOR(S)
//
//  Whenever the Myo receives an orientation event, it will now emit a vector event,
//  with a data object that was a x, y, and theta, all ranging from -1 to 1.
//
//  Note: These numbers are very dependant on the Myo being orientated properly.
//  Make sure to use myo.zeroOrientation() often to correct for any drift.
//
export default function hardtap(myo) {
    // get device interface & plugins
    const { device, plugins } = myo;

    // extend myo plugins
    plugins.vector = true;

    // listen to device orientation
    myo.on('orientation', (quanternion) => {
        const horizontalComponent = Math.sin(yaw(quanternion)) * Math.cos(pitch(quanternion));
        const verticalComponent = Math.sin(pitch(quanternion));
        const rawTheta = roll(device.orientationOffset);

        // emit event
        myo.emit('vector', {
            x: Math.sin(rawTheta) * verticalComponent - Math.cos(rawTheta) * horizontalComponent,
            y: Math.cos(rawTheta) * verticalComponent + Math.sin(rawTheta) * horizontalComponent,
            theta: Math.sin(roll(quanternion))
        });
    });
}
