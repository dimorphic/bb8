// deps
import CONSTANTS from '../constants';

//
//  Myo HANDLERS
//
export function handleEvents(device) {
    console.log('[MYO] Setting EVENTZ handlers');

    // default myo events
    const { EVENTS } = CONSTANTS.MYO;

    // attach default events
    EVENTS.forEach((event) => {
        device.on(event, (data) => {
            // treat POSE events differently
            if (event === 'pose' || event === 'pose_off') {
                let pose = data;

                // emit generic event (pose / pose_off)
                this.emit(event, pose);

                // adjust pose if off
                if (event === 'pose_off') {
                    pose = pose + '_off';

                    // emit generic pose event with pose_off
                    this.emit('pose', pose);
                }

                // emit specific event
                // eg: fist, fingers_spread, wave_in, wave_out
                // fist_off, fingers_spread_off, etc.
                this.emit(pose);
            } else {
                // ... or emit / mirror generic event
                this.emit(event, data);
            }
        });
    });
}
