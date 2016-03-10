import { default as fixture2Imported } from './fixture2.js';
const fixture2Required = require('./fixture2.js');
import fixture3 from '../test/fixture3.js';
import fs from 'fs';

export default {
  fixture2Imported,
  fixture2Required: fixture2Required.default,
  fixture3,
  fs,
};
