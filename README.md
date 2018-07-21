# vbb-rest

***vbb-rest* is a public transport REST API**, a clean alternative to the [VBB HAFAS API](https://github.com/derhuerst/vbb-hafas). [It has lots of advantages over theirs.](docs/why.md)

**[API documentation](docs/index.md)**

~~Use [`vbb-client@3`](https://github.com/derhuerst/vbb-client) for querying this API in browsers or with Node.~~ VBB has blocked our API servers' IP addresses, so we can't provide a public endpoint for now. **If you use JavaScript to process the data, use [`vbb-hafas`](https://github.com/derhuerst/vbb-hafas) directly, otherwise host your `vbb-rest` instance for now.**

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
