// deps
import core from './core';
import debug from './debug';
import aspect from './aspect';
import movement from './movement';

// commands mutator
export default function (bb8) {
    // add commands
    core(bb8);
    debug(bb8);

    aspect(bb8);
    movement(bb8);
}
