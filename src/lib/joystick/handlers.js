// deps
import { JOYSTICK } from '../constants';

//
//  BUTTONS handler
//
export function handleButtons(device) {
    console.log('[JOYSTICK] Setting BUTTONS handlers');

    // get joystick controller device
    const { controller } = device;

    // default xbox buttons (no sticks)
    const BUTTONS = JOYSTICK.BUTTONS;

    // attach button events
    BUTTONS.forEach((button) => {
        const pressEvent = `${button}:${JOYSTICK.PRESS}`;
        const releaseEvent = `${button}:${JOYSTICK.RELEASE}`;

        // on press
        controller.on(pressEvent, () => {
            // console.log('Button ' + pressEvent);

            // emit generic event (button:action, buttonName)
            this.emit(`button:${JOYSTICK.PRESS}`, button);

            // emit/mirror specific event (buttonName:action, buttonName)
            this.emit(pressEvent);
        });

        // on release
        controller.on(releaseEvent, () => {
            // console.log('Button ' + releaseEvent);

            // emit generic event (button:action, buttonName)
            this.emit(`button:${JOYSTICK.RELEASE}`, button);

            // emit/mirror specific event (buttonName:action, buttonName)
            this.emit(releaseEvent);
        });
    });
}

//
//  STICKS handler
//
export function handleSticks(device) {
    console.log('[JOYSTICK] Setting STICKS handlers');

    // get joystick controller device
    const { controller } = device;

    // default xbox control sticks
    const STICKS = JOYSTICK.STICKS;
    // const STICK_THRESHOLD = 0.1; // @TODO

    // attach sticks events
    STICKS.forEach((stick) => {
        const moveEvent = `${stick}:${JOYSTICK.MOVE}`;

        // on move
        controller.on(moveEvent, (pos) => {
            // console.log(`[JOYSTICK] Stick ${stick} @ ${pos}`);
            // if (!pos > STICK_THRESHOLD) { return void 0; }

            // update internal sticks positions pointer
            handleStickPosition.call(this, stick, pos);

            // mirror event
            // @TODO: emit full x/y positions instead of single ?
            this.emit(`stick:${JOYSTICK.MOVE}`, stick, pos);

            // emit/mirror specific event (stickName:action)
            this.emit(moveEvent, pos);
        });
    });
}

//
//  TRIGGERS handler
//
export function handleTriggers(device) {
    console.log('[JOYSTICK] Setting TRIGGERS handlers');

    // get joystick controller device
    const { controller } = device;

    // default xbox control triggers
    const TRIGGERS = JOYSTICK.TRIGGERS;
    // const TRIGGER_THRESHOLD = 0.1; // @TODO

    // attach triggers events
    TRIGGERS.forEach((trigger) => {
        const event = `${trigger}:${JOYSTICK.MOVE}`;

        // on move
        controller.on(event, (pos) => {
            // console.log(`[JOYSTICK] Trigger ${trigger} @ ${pos}`);

            // mirror event
            this.emit(`trigger:${JOYSTICK.MOVE}`, trigger, pos);
        });
    });
}

//
//  STICK POSITION HANDLER
//
function handleStickPosition(stick, position) {
    // get device sticks
    const { sticks } = this;

    // get stick type and coord to update
    const [STICK_TYPE, STICK_COORD] = stick.split('_');
    const STICK = sticks[STICK_TYPE];

    // exit if stick unrecognized
    if (!STICK || !position) { return void 0; }

    // update stick coordonate position
    STICK[STICK_COORD] = position;
}
