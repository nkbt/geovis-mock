# geovis-mock [![npm](https://img.shields.io/npm/v/geovis-mock.svg?style=flat-square)](https://www.npmjs.com/package/geovis-mock)
            
[![Discord](https://img.shields.io/badge/chat-discord-blue.svg?style=flat-square)](https://discord.gg/013tGW1IMcW6Vd1o7)

[![CircleCI](https://img.shields.io/circleci/project/nkbt/geovis-mock.svg?style=flat-square)](https://circleci.com/gh/nkbt/geovis-mock)
[![Coverage](https://img.shields.io/coveralls/nkbt/geovis-mock.svg?style=flat-square)](https://codecov.io/github/nkbt/geovis-mock?branch=master)
[![Dependencies](https://img.shields.io/david/nkbt/geovis-mock.svg?style=flat-square)](https://david-dm.org/nkbt/geovis-mock)
[![Dev Dependencies](https://img.shields.io/david/dev/nkbt/geovis-mock.svg?style=flat-square)](https://david-dm.org/nkbt/geovis-mock#info=devDependencies)


Mock to feed GeoVis server with data


## Installation

```sh
npm install --global @nkbt/geovis-mock
```


## Usage


### Running mock

#### CLI

```sh
> WS_HOST=localhost WS_PORT=10000 geovis-mock
```

#### API

```js
const {run} = require('@nkbt/geovis-mock');

const {
  WS_HOST = 'localhost',
  WS_PORT = 10000
} = process.env;

run({WS_HOST, WS_PORT});
```


### Logging

```sh
06:38 $ ./bin.js 
connecting to ws://localhost:10000...
connected
>> {"action":"GEO_BROADCAST","payload":[{"srcLat":55.751244,"srcLon":37.618423,"dstLat":49.246292,"dstLon":-123.116226,"value":3}]}
>> {"action":"GEO_BROADCAST","payload":[{"srcLat":50.411198,"srcLon":30.446634,"dstLat":55.751244,"dstLon":37.618423,"value":4}]}
>> {"action":"GEO_BROADCAST","payload":[{"srcLat":-33.865143,"srcLon":151.2099,"dstLat":-12.462827,"dstLon":130.841782,"value":6}]}
disconnected
```


## Development and testing

Currently is being developed and tested with the latest stable `Node 6` under `OSX`.

```bash
git clone git@github.com:nkbt/geovis-mock.git
cd geovis-mock
npm install
```


## Tests

```bash
# to run tests
npm test

# to generate test coverage (./coverage)
npm run cov
```


## License

MIT
