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
    DIRECTIONS: {
        'FORWARD': 0,
        'REVERSE': 180,
        'LEFT': 270,
        'RIGHT': 90
    }
};

// expose
module.exports = {
    JOYSTICK,
    BB8
};
