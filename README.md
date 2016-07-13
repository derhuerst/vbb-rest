# vbb-rest

***vbb-rest* is a public transport REST API**, a clean alternative to the [VBB HAFAS API](https://github.com/derhuerst/vbb-hafas). [It has lots of advantages over their API.](docs/why.md)

Refer to the [API Documentation](docs/index.md). Use [vbb-client](https://github.com/derhuerst/vbb-client) for querying this API in the Browser or with Node.js.

[![npm version](https://img.shields.io/npm/v/vbb-rest.svg)](https://www.npmjs.com/package/vbb-rest)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-rest.svg)](https://david-dm.org/derhuerst/vbb-rest)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-rest.svg)
[![gitter channel](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst/vbb-rest)


## Installing

```
git clone https://github.com/derhuerst/vbb-rest.git
cd vbb-rest
npm install --production
npm start
```

*Note*: [*forever*](https://github.com/foreverjs/forever#readme) actually isn't  required to run `vbb-rest`, but listed as a [peer dependency](https://docs.npmjs.com/files/package.json#peerdependencies). The `npm start` script calls *forever* for production usage, so to run `npm start`, you need to `npm install [-g] forever` before.


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-rest/issues).
