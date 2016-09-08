'use strict';


const websocket = require('ws');


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
const rnd = (min, max) => (
  max === undefined ?
    Math.round(Math.random() * min) :
    (min + Math.round(Math.random() * max))
);
const sample = arr => arr[rnd(arr.length - 1)];


const mkAttack = ([srcLat, srcLon], [dstLat, dstLon]) => ({
  srcLat, srcLon, dstLat, dstLon, value: rnd(1, 10)
});


const start = send => {
  const sendGeo = () => {
    send(null, {
      action: 'GEO_BROADCAST',
      payload: [mkAttack(...sample(sampleAttacks))]
    });
  };

  const interval = setInterval(sendGeo, 2000);
  sendGeo();


  return () => {
    clearInterval(interval);
  };
};


const encode = obj => JSON.stringify(obj);


const mock = ({WS_HOST, WS_PORT}) => {
  const responder = function (err, payload) {
    if (err) {
      console.log('  ER', err);
      return;
    }
    if (this.readyState !== 1) {
      console.log('ER', 'Socket closed');
      return;
    }
    const response = encode(payload);
    console.log('>>', response.substr(0, 250));
    this.send(response);
  };


  const onConnect = function () {
    console.log('connected');
    this.stop = start(responder.bind(this));
  };


  const onClose = function () {
    console.log('disconnected');
    if (this.stop) {
      this.stop();
    }
  };


  console.log(`connecting to ws://${WS_HOST}:${WS_PORT}...`);
  const ws = websocket.connect(`ws://${WS_HOST}:${WS_PORT}`, onConnect);
  ws.on('close', onClose);


  return ws;
};


module.exports = mock;
