// deps
import BLE from 'noble';
import { inspect } from './lib/helpers';

BLE.on('stateChange', (state) => {
    console.log('[BLE] BLE state @ ', state);

    BLE.startScanning();
});

BLE.on('discover', (peripheral) => {
    console.log('[BLE] Discover @ ', inspect(peripheral, 1));
});


process.on('close', () => { BLE.stopScanning(); });
