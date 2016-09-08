#! /usr/bin/env node


'use strict';


const {
  WS_HOST = 'localhost',
  WS_PORT = 10000
} = process.env;


const {run} = require('.');


run({WS_HOST, WS_PORT});
