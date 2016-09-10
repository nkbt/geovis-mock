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
const SF = [38.006811, -122.667424];
const LONDON = [51.509865, -0.118092];
const VANCOUVER = [49.246292, -123.116226];
const MOSCOW = [55.751244, 37.618423];
const KYIV = [50.411198, 30.446634];
const TOKYO = [35.717243, 19.761646];
const MUMBAI = [19.064499, 72.919112];
const MADRID = [40.395906, -3.581182];
const DUBLIN = [53.464008, -6.218773];
const MIAMI = [25.669930, -80.126130];
const LIMA = [-12.126830, -77.042177];
const BUENOS_AIRES = [-34.309534, -58.700775];


const cities = [
  SYD,
  DARWIN,
  NY,
  SF,
  LONDON,
  VANCOUVER,
  MOSCOW,
  KYIV,
  TOKYO,
  MUMBAI,
  MADRID,
  DUBLIN,
  MIAMI,
  LIMA,
  BUENOS_AIRES
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


const mkAttack = (src, dst, color = sample(colors)) => ({
  id: `${cities.indexOf(src)}|${cities.indexOf(dst)}`,
  srcLat: src[0],
  srcLon: src[1],
  dstLat: dst[0],
  dstLon: dst[1],
  value: rnd(1, 10),
  color
});


const start = (send, {GEO_TIMEOUT = 2000, GEO_COLOR}) => {
  const sendGeo = () => {
    const src = sample(cities);
    const other = [].concat(cities);
    other.splice(cities.indexOf(src), 1);
    const dst = sample(other);

    send(null, {
      action: 'GEO_BROADCAST',
      payload: [mkAttack(src, dst, GEO_COLOR)]
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
