'use strict';


const test = require('tape');
const {run} = require('..');


test('Test', t => {
  t.ok(run instanceof Function, 'should be function');
  t.end();
});
