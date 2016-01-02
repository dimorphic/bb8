// deps
import util from 'util';

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
};
