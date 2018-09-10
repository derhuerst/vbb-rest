# vbb-rest

***vbb-rest* is a public transport REST API**, a clean alternative to the [VBB HAFAS API](https://github.com/derhuerst/vbb-hafas). [It has lots of advantages over theirs.](docs/why.md)

~~Use [`vbb-client@3`](https://github.com/derhuerst/vbb-client) for querying this API in browsers or with Node.~~ VBB has blocked our API servers' IP addresses, so **[the public `2.vbb.transport.rest` endpoint](https://2.vbb.transport.rest/) [is down](https://status.transport.rest/779961406)**. For the time being, you have two choices:

- Use the [`1.bvg.transport.rest`](https://1.bvg.transport.rest/) endpoint. It returns data from the BVG HAFAS API, which is almost exactly the same. Check the docs at [`derhuerst/bvg-rest`](https://github.com/derhuerst/bvg-rest/blob/master/readme.md)!
- Host your `vbb-rest` instance. See below for instructions.

![vbb-rest architecture diagram](https://rawgit.com/derhuerst/vbb-rest/master/architecture.svg)

[![dependency status](https://img.shields.io/david/derhuerst/vbb-rest.svg)](https://david-dm.org/derhuerst/vbb-rest)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-rest.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## installing & running

### via Docker

A Docker image [is available as `derhuerst/vbb-rest`](https://hub.docker.com/r/derhuerst/vbb-rest).

```shell
docker run -d -p 3000:3000 derhuerst/vbb-rest
```

### manually

```shell
git clone https://github.com/derhuerst/vbb-rest.git
cd vbb-rest
git checkout 2
npm install --production
npm start
```

To keep the API running permanently, use tools like [`forever`](https://github.com/foreverjs/forever#forever), [`pm2`](http://pm2.keymetrics.io) or [`systemd`](https://wiki.debian.org/systemd).


## Contributing

If you have a question or have difficulties using `vbb-rest`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/vbb-rest/issues).
