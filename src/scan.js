// deps
const BLE = require('noble');
const { inspect } = require('./lib/helpers');

// get state of Bluetooth
BLE.on('stateChange', (state) => {
    console.log('[BLE] BLE state @ ', state);
    BLE.startScanning();
});

BLE.on('discover', (peripheral) => {
    console.log('[BLE] Discovered device ID:', peripheral.uuid || peripheral.id);
    console.log('[BLE] Device info: ', inspect(peripheral, 1));
});

// stop scanning
process.on('close', () => { BLE.stopScanning(); });
