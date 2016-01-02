// deps
// import tracer from 'tracer';
import util from 'util';

//
//	BETTER CONSOLE LOG helper
//
/*
const logger = tracer.colorConsole({
    format: [
		// default format
        '{{timestamp}} [{{title}}] {{message}} [{{file}}:{{line}}]',

		// error format
        { error: '{{timestamp}} <{{title}}> {{message}} [in {{file}}:{{line}}]\nCall Stack:\n{{stack}}' }
    ],
    dateformat: '[HH:MM:ss.L]',
    preprocess: function preprocess(data) {
        data.title = data.title.toUpperCase();
    }
});
*/

//
//  object representation / stringify
//
const inspect = (obj) => {
    return util.inspect(obj, {
        showHidden: true,
        colors: true,
        depth: null // go deep!
    });
};

// exports
module.exports = {
    inspect
    // logger
};
