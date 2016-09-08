'use strict';


const mock = require('./mock');


exports.run = ({WS_HOST, WS_PORT}) => mock({WS_HOST, WS_PORT});
exports.mock = mock;
