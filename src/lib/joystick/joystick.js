// deps
import EventEmitter from 'events';
import Cylon from 'cylon';

// handlers & commands
// import { JOYSTICK } from '../constants';
import * as HANDLERS from './handlers';
import commands from './commands';

//
//  Joystick Class
//
export default class Joystick extends EventEmitter {
    constructor(options = {}) {
        super();

        // spread options
        // const { handlers } = options;

        // default config
        const DEFAULTS = {
            // device adaptor & driver,
            name: 'JOYSTICK',
            connections: { joystick: { adaptor: 'joystick' } },
            devices: { controller: { driver: 'xbox-360' } },

            work: this.onConnect.bind(this),
            autoConnect: false
        };

        // extend default config with options
        this.config = Object.assign({}, DEFAULTS, options);

        // device inteface controller
        this.device = null;

        // position pointers
        this.sticks = {
            left: { x: 0, y: 0 },
            right: { x: 0, y: 0 }
        };

        // just do it
        this.init();
    }

    init() {
        // create adaptor
        this.device = Cylon.robot(this.config);

        // add commands via mutator
        commands(this);

        // connect it!
        if (this.config.autoConnect) {
            this.connect();
        }
    }

    connect() {
        this.device.start();
    }

    disconnect() {
        // @TODO
    }

    //
    //  on device connect
    //  param: my (Object)
    //  all config.devices are injected via 'my' arg
    //
    onConnect(my) {
        console.log('[JOYSTICK] Connected');

        // add button events
        this.setHandlers(this.device);
    }

    setHandlers(device) {
        // console.log(
        //     '[JOYSTICK] Setting handlers...',
        //     Object.keys(device.controller).length,
        //     '\n\n',
        //     Object.keys(this.device.controller).length
        // );

        HANDLERS.handleButtons.call(this, device);
        HANDLERS.handleSticks.call(this, device);
        HANDLERS.handleTriggers.call(this, device);
    }

    //
    //  get stick controller
    //
    getStick(stickSide) {
        return this.sticks[stickSide];
    }

    //
    //  get stick controller side
    //
    getStickSide(stickName) {
        return stickName.split('_')[0];
    }

}
