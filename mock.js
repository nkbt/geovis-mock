'use strict';


const websocket = require('ws');
const c = require('colors/safe');

c.setTheme({
  info: 'green',
  data: 'grey',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});


const SYD = [-33.865143, 151.209900];
const DARWIN = [-12.462827, 130.841782];
const NY = [40.730610, -73.935242];
const LONDON = [51.509865, -0.118092];
const VANCOUVER = [49.246292, -123.116226];
const MOSCOW = [55.751244, 37.618423];
const KYIV = [50.411198, 30.446634];
const sampleAttacks = [
  [SYD, NY],
  [SYD, DARWIN],
  [KYIV, MOSCOW],
  [VANCOUVER, NY],
  [MOSCOW, VANCOUVER],
  [LONDON, NY]
];
const colors = [
  0x33ff33,
  0xffff33,
  0xff3333
];

const rnd = (min, max) => (
  max === undefined ?
    Math.round(Math.random() * min) :
    (min + Math.round(Math.random() * max))
);
const sample = arr => arr[rnd(arr.length - 1)];


const mkAttack = ([srcLat, srcLon], [dstLat, dstLon], color = sample(colors)) => ({
  srcLat, srcLon, dstLat, dstLon, value: rnd(1, 10), color
});


const start = (send, {GEO_TIMEOUT = 2000, GEO_COLOR}) => {
  const sendGeo = () => {
    send(null, {
      action: 'GEO_BROADCAST',
      payload: [mkAttack(...sample(sampleAttacks), GEO_COLOR)]
    });
  };

  const interval = setInterval(sendGeo, GEO_TIMEOUT);
  sendGeo();


  return () => {
    clearInterval(interval);
  };
};


const encode = obj => JSON.stringify(obj);


const log = (...args) => console.log(c.data('GeoVis Mock'), ...args);
const error = (...args) => log(c.error('[ERROR]'), ...args);
const warn = (...args) => log(c.warn('[INFO] '), ...args);
const info = (...args) => log(c.info('[INFO] '), ...args);
const debug = (...args) => log(c.debug('[DEBUG]'), ...args.map(c.data));


const mock = ({WS_HOST, WS_PORT, GEO_TIMEOUT, GEO_COLOR}) => {
  function responder(err, payload) {
    if (err) {
      warn(err.message);
      return;
    }
    if (this.readyState !== 1) {
      warn('socket closed');
      return;
    }
    const response = encode(payload);
    debug(response.substr(0, 250));
    this.send(response);
  }


  function onConnect() {
    info('connected');
    this.stop = start(responder.bind(this), {GEO_TIMEOUT, GEO_COLOR});
  }


  function onClose() {
    info('disconnected');
    if (this.stop) {
      this.stop();
    }
  }


  function onError(err) {
    error(err.message);
  }


  info(`connecting to ws://${WS_HOST}:${WS_PORT}...`);
  const ws = websocket.connect(`ws://${WS_HOST}:${WS_PORT}`, onConnect);
  ws.on('close', onClose);
  ws.on('error', onError);


  return ws;
};


module.exports = mock;
