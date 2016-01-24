// deps
import EventEmitter from 'events';
import * as MYO from 'myo';

// handlers & commands
import * as HANDLERS from './handlers';
import commands from './commands';

// plugins
import plugins from './plugins';

// helpers
// import CONSTANTS from '../constants';
// const { COMMANDS, EVENTS } = CONSTANTS.MYO;

//
//  Myo Class
//
// export default class Myo {
export default class Myo extends EventEmitter {
    constructor(options = {}) {
        super();

        // default config
        const DEFAULTS = {
            domain: 'com.localhost.myo',
            autoConnect: false,

            plugins: [
                'busyarm',
                'flex',
                'vector',
                'hardtap',
                'snap'
            ]
        };

        // extend default config with options
        this.config = Object.assign({}, DEFAULTS, options);

        // device inteface controller
        this.connector = null; // global controller
        this.device = null; // our device
        this.plugins = {};

        // boot it up
        this.init();
    }

    init() {
        // create interface
        this.connector = this.createInterface();

        // auto connect?
        if (this.config.autoConnect) {
            this.connect();
        }
    }

    createInterface() {
        return MYO;
    }

    connect() {
        console.log('[MYO] Connecting...');

        const { connector } = this;
        const onConnect = this.onConnect.bind(this);

        // note: don't use method shorthand here
        // ...need to catch 'this' as that will be a Myo device connected
        connector.on('connected', function onDeviceDiscover() {
            console.log('[MYO] Device discovered');
            onConnect(this);
        });

        connector.connect(this.config.domain);
    }

    disconnect() {
        console.log('[MYO] Disconnecting...');
        this.device.disconnect();
    }

    setDevice(device) {
        console.log('[MYO] Setting default device');
        this.device = device;
    }

    getDevice() {
        return this.device;
    }

    //
    //  on device connect
    //  myo devices that connect are injected as 'this'
    //
    onConnect(device) {
        console.log('[MYO] Device connected');

        // bind first device connected as 'ours'
        this.setDevice(device); // connector.myos[0]

        // add commands via mutator
        commands(this);
        plugins(this);

        // add event handlers
        this.setHandlers(this.device);
    }

    setHandlers(device) {
        // @TODO
        HANDLERS.handleEvents.call(this, device);
        // HANDLERS.handleGestures.call(this, device);
    }

    // on(eventName, callback) {
    //     return this.connector.on(eventName, callback);
    // }
    //
    // off(eventName) {
    //     return this.connector.off(eventName);
    // }
    //
    // trigger(eventName) {
    //     const args = Array.prototype.slice.apply(arguments).slice(1);
    //     return this.connector.trigger(eventName, args);
    // }
}
