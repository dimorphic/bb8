// deps
import util from 'util';
import { spawn } from 'child_process';

// respawn code
const RESPAWN_CODE = 7; // holy humber!

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
//  respawn requester
//  exit process with custom code
//
const respawnMe = () => {
    process.exit(RESPAWN_CODE);
};

//
//  respawner
//
const respawner = (app, args = []) => {
    if (!app) {
        throw new Error('Need app/process to spawn, bro!');
    }

    // spawn it
    const proc = spawn(app, args, { stdio: 'inherit' });

    // when this process gets terminated (as user intends)
    // ...spawn again
    proc.on('close', (code) => {
        if (code === RESPAWN_CODE) respawner(app, args);
    });
};

// exports
module.exports = {
    inspect,

    respawner,
    respawnMe
};
