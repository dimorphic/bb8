//
//  JOYSTICK
//  (default: xbox360)
//
const JOYSTICK = {
    'MOVE': 'move',
    'PRESS': 'press',
    'RELEASE': 'release',

    // standard buttons
    BUTTONS: [
        'a', 'b', 'x', 'y',
        'start', 'home', 'select',
        'rb', 'lb'
    ],

    // precission sticks
    STICKS: [
        'left_x', 'left_y',
        'right_x', 'right_y'
    ],

    // fine trigger controls
    TRIGGERS: ['lt', 'rt']
};

//
//  SPHERO (v2) - Starwars BB8
//
const BB8 = {
    DIRECTION: {
        'FORWARD': 0,
        'REVERSE': 180,
        'LEFT': 270,
        'RIGHT': 90
    },

    DRIVE_MODE: {
        'NORMAL': 0x00000000,
        'VECTOR': 0x00000002
    }
};

//
//  MYO
//
const MYO = {
    POSES: [
        'fist',
        'fingers_spread',
        'wave_in',
        'wave_out'
    ],

    COMMANDS: [
        'lock',
        'unlock',
        'zeroOrientation',
        'vibrate',
        'requestBatteryLevel',
        'requestBluetoothStrength',
        'streamEMG'
    ],

    EVENTS: [
        // stream events
        'pose',
        'pose_off',
        'rest',
        'status',

        'accelerometer',
        'gyroscope',
        'orientation',
        'emg',
        'imu',

        // status events
        'connected',
        'disconnected',

        'arm_synced',
        'arm_unsynced',
        'warmup_completed',

        'locked',
        'unlocked',

        'rssi',
        'battery_level',
        'bluetooth_strength'
    ]
};

// expose
module.exports = {
    JOYSTICK,
    BB8,
    MYO
};
