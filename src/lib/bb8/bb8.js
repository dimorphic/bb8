// deps
import EventEmitter from 'events';
import sphero from 'sphero';

// events and handlers
import commands from './commands';

// @DEBUG
import { inspect } from '../helpers';

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
        this.debug = false; // need console.logs, bro ?

        // device interface controller
        this.device = null;

        // status 'flags'
        this.isConnected = false;   // online?
        this.isCalibrating = false; // stablization on?
        this.driveMode = false;     // enable Vector Drive? (check bb8.setPermFlags)
        this.userControl = false;

        // orb props
        this.color = null;
        this.orientation = 0;
        this.speed = 0;
        // this.boost = 0; // @TODO

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

        // @TODO: fix this.
        // sphero.disconnect() doesn't kill connection
        // clear device for now?
        this.device.disconnect(this.onDisconnect.bind(this));
    }

    reconnect() {
        console.log('[BB8] Experimental (wakeup) reconnect...'); //

        // disconnect if connected
        if (this.isConnected || this.device) {
            this.disconnect(); // this doesn't kill connection. need @FIX

            // workaround?
            this.wakeup(this.connect.bind(this));
        }
    }

    onConnect() {
        console.log('[BB8] Connected!');

        // get orb props / flags
        this.getOrbProps();

        // set connect and emit event
        this.isConnected = true;
        this.emit('connect');
    }

    onDisconnect() {
        console.log('[BB8] Disconnected! :<');

        this.isConnected = false;
        this.emit('disconnect');
    }

    wakeup(callback) {
        // workaround
        const { connection } = this.device;

        if (connection) {
            connection.wake(() => {
                console.log('droid wake call!');
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    }

    getOrbProps() {
        // get device perm flags
        this.device.getPermOptionFlags((err, data) => {
            if (!err) { return void 0; }
            this.driveMode = data.vectorDrive;
        });

        // get orb current color (if any, default 0x000000)
        this.getCurrentColor((color) => {
            console.log('[BB8] Current color @ ', color);
            this.color = color;
        });
    }
}
