// deps
import EventEmitter from 'events';
import sphero from 'sphero';

// events and handlers
import commands from './commands';

// @DEBUG
// import { inspect } from '../../helpers';

//
//  BB8 mighty droid
//
export default class BB8 extends EventEmitter {
    constructor(options = {}) {
        super();

        // default settings
        const DEFAULTS = {
            uuid: null,
            btAddress: null,

            name: null,
            color: null,

            autoConnect: false,

            // due to some sphero limitations,
            // it's better to throttle delay and not spam skill BB8 droid
            // (@TODO: fix SDK packets)
            // throttleCommands: false, // BLE anti-spam?

            BLUETOOTH_THROTTLE_DELAY: 100 // BLE commands throttle min delay
            // BLUETOOTH_TX_POWER: null // @TODO: BLE transmit power (range!)
        };

        // extend default config with options
        this.config = Object.assign({}, DEFAULTS, options);

        // device interface controller
        this.device = null;
        this.userControl = false;

        // status 'flags'
        this.isConnected = false; // online?
        this.isCalibrating = false; // stablization on?

        // orb props
        this.orientation = 0;
        this.speed = 0;

        // boot it up
        this.init();
    }

    init() {
        // create interface
        this.device = this.createInterface();

        // add commands via mutator
        commands(this);

        // auto connect?
        if (this.device && this.config.autoConnect) {
            this.connect();
        }
    }

    createInterface() {
        if (!this.config.uuid) {
            throw new Error('[BB8] Need BB8 device UUID, bro!');
        }

        return sphero(this.config.uuid);
    }

    connect() {
        console.log('[BB8] Connecting...');
        this.device.connect(this.onConnect.bind(this));
    }

    disconnect() {
        console.log('[BB8] Disconnecting...');

        // @TODO: fix this. doesn't kill connection
        // clear device for now?
        this.device.disconnect(this.onDisconnect.bind(this));
    }

    reconnect() {
        console.log('experimental reconnect...'); //

        // disconnect if connected
        if (this.isConnected || this.device) {
            this.disconnect();
            // return void 0;

            // workaround
            const { connection } = this.device;
            if (connection) {
                connection.wake(() => {
                    this.connect();
                });
            }
        }

        // connect
        // this.connect(); // doesn't work in another fn? dafak
    }

    onConnect() {
        console.log('[BB8] Connected!');

        this.isConnected = true;
        this.emit('connect');
    }

    onDisconnect() {
        console.log('[BB8] Disconnected! :<');

        this.isConnected = false;
        this.emit('disconnect');
    }
}
