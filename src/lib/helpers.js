// deps
const util = require('util');
const { spawn } = require('child_process');

// @TODO: split this to respawn(er).js ?
// respawn code
const RESPAWN_CODE = 7; // holy humber!

//
//  respawn requester
//  exit process with custom code
//
const respawnMe = () => {
    process.exit(RESPAWN_CODE);
};

//
//  respawner
//
const respawner = (app, args = [], opts = {}) => {
    if (!app) {
        throw new Error('Need app/process to spawn, bro!');
    }

    // default options
    const options = Object.assign({}, { stdio: 'inherit' }, opts);

    // spawn it
    const proc = spawn(app, args, options);

    // when this process gets terminated (as user intends)
    // ...spawn again
    proc.on('close', (code) => {
        if (code === RESPAWN_CODE) respawner(app, args, options);
    });
};

//
//  object representation / stringify
//
const inspect = (obj, depth = null) => {
    return util.inspect(obj, {
        showHidden: true,
        colors: true,
        depth// go deep!
    });
};

//
//  fill array helper (till Array.fill)
//
const fillArray = (size, item) => {
    return Array.apply(null, Array(size)).map(() => { return item; });
};

// exports
module.exports = {
    inspect,
    fillArray,

    respawner,
    respawnMe
};
