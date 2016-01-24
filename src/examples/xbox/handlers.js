//
//  HANDLERS
//  to control BB8 via Xbox controller
//
export default function (droid, xbox) {
    const HANDLERS = {};

    //
    //  ADD COMMAND(S) CONTROLS
    //
    HANDLERS.addControls = (controls) => {
        const EVENTS = Object.keys(controls);

        EVENTS.forEach((event) => {
            xbox.on(event, controls[event]);
        });
    };

    //
    //  REMOVE COMMAND(S) CONTROLS
    //
    HANDLERS.removeControls = (controls) => {
        const EVENTS = Object.keys(controls);

        EVENTS.forEach((event) => {
            xbox.removeListener(event, controls[event]);
        });
    };

    return HANDLERS;
}
