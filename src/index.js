// deps
require('source-map-support').install();
const path = require('path');

// deps
import { respawner } from './lib/helpers';

// (re) spawn droid
respawner('node', ['examples/myo'], { cwd: path.resolve(__dirname) });
