require('source-map-support').install();

// deps
import { respawner } from './lib/helpers';

// (re) spawn droid
respawner('node', ['./dist/droid.js']);
