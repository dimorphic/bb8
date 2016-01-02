// deps
import EventEmitter from 'events';
import sphero from 'sphero';

// events and handlers
import commands from './commands';

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
        };

        // extend default config with options
        this.config = Object.assign({}, DEFAULTS, options);

        // device inteface controller
        this.device = null;

        // status 'flags'
        this.isConnected = false;
        this.isCalibrating = false;

        // orb props
        this.orientation = 0;
        this.speed = 0;

        // boot it up
        this.init();
    }

    init() {
        if (!this.config.uuid) {
            throw new Error('[BB8] Need BB8 device UUID, bro!');
        }

        // create interface
        this.device = sphero(this.config.uuid);

        // add commands via mutator
        commands(this);

        // auto connect?
        if (this.config.autoConnect) {
            setTimeout(() => {
                console.log('delayed connect');
                this.connect();
            }, 3000);
        }
    }

    connect() {
        console.log('[BB8] Connecting...');

        this.device.on('error', (err) => {
            console.error('[BB8] Error @ ', err);
        });

        this.device.connect(this.onConnect.bind(this));
        // this.device.connect.call(this, this.onConnect);
    }

    disconnect() {
        console.log('[BB8] Disconnecting...');

        // @TODO: fix this
        // disconnect doesn't kill connection
        this.device.disconnect(this.onDisconnect.bind(this));
    }

    reconnect() {
        // disconnect if connected
        if (this.isConnected) {
            this.disconnect();
            return void 0;
        }

        // connect
        this.connect(); // doesn't work in another fn? dafak
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
