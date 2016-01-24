//
//  COMMANDS and HANDLERS
//  to control BB8 via Xbox controller
//
export default function (droid, xbox) {
    // magic powers
    const COMMANDS = {};

    // XBOX fine control sticks / triggers threshold
    const STICK_THRESHOLD = 0.3;

    //
    //  HANDLERS
    //
    COMMANDS.handleTriggers = (trigger, position) => {
        // LEFT
        if (trigger === 'lt') {
            droid.throttleStop(); // emergency stop

        // RIGHT
        } else if (trigger === 'rt') {
            const speed = xbox.convertPositionToSpeed(position);

            // update speed pointer
            droid.setSpeed(speed);

            // move it!
            droid.throttleMove();
        }
    };

    COMMANDS.handleSticks = (stick, position) => {
        const inRange = xbox.positionInRange(position, STICK_THRESHOLD);

        if (!inRange) { return void 0; }

        // get stick side/type
        const stickSide = xbox.getStickSide(stick);
        const stickPosition = xbox.getStick(stickSide);

        // we haz stabilization ?
        const isCalibrating = droid.isCalibrating;

        // LEFT
        if (stickSide === 'left' && !isCalibrating) {
            COMMANDS.controlMovement(stickPosition.x, stickPosition.y);
        // RIGHT
        } else if (stickSide === 'right' && isCalibrating) {
            COMMANDS.controlCalibration(stickPosition.x, stickPosition.y);
        }
    };

    //
    //  MOVEMENT CONTROL
    //
    COMMANDS.controlMovement = (x, y) => {
        const angle = ~~(droid.getAngle(x, y));

        // update orientation pointer
        droid.orientation = angle;

        // move it!
        droid.throttleMove();
    };

    COMMANDS.controlCalibration = (x, y) => {
        const angle = ~~(droid.getAngle(x, y));

        // turn droid!
        droid.throttleTurn(angle);
    };

    //
    //  COLOR CONTROL
    //
    COMMANDS.controlColor = (button) => {
        // console.log('button @ ', button);

        const BUTTONS = {
            'x': 'blue',
            'y': 'yellow',
            'b': 'red',
            'a': 'green'
        };

        // abort if no color
        if (!BUTTONS[button]) { return void 0; }

        // set droid color
        // console.log('droid new color @ ', BUTTONS[button]);
        droid.setColor(BUTTONS[button]);
    };

    // expose
    return COMMANDS;
}
