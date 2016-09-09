#! /usr/bin/env node


'use strict';


const {
  WS_HOST = 'localhost',
  WS_PORT = 10000,
  GEO_TIMEOUT,
  GEO_COLOR
} = process.env;


const {run} = require('.');


run({WS_HOST, WS_PORT, GEO_TIMEOUT, GEO_COLOR: GEO_COLOR ? parseInt(GEO_COLOR, 16) : undefined});
