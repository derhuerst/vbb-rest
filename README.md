# vbb-rest

***vbb-rest* is a public transport REST API**, a clean alternative to the [VBB HAFAS API](https://github.com/public-transport/hafas-client/blob/master/p/vbb/readme.md).

~~Use [`vbb-client@4`](https://github.com/derhuerst/vbb-client) for querying this API in browsers or with Node.~~

[API Documentation](docs/index.md) | [Why?](docs/why.md)

![vbb-rest architecture diagram](architecture.svg)

[![Docker build status](https://img.shields.io/docker/build/derhuerst/vbb-rest.svg)](https://hub.docker.com/r/derhuerst/vbb-rest/)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-rest.svg)](https://david-dm.org/derhuerst/vbb-rest)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-rest.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## installing & running

### via Docker

A Docker image [is available as `derhuerst/vbb-rest:5`](https://hub.docker.com/r/derhuerst/vbb-rest:5).

```shell
docker run -d -p 3000:3000 derhuerst/vbb-rest:5
```

### manually

```shell
git clone https://github.com/derhuerst/vbb-rest.git
cd vbb-rest
git checkout 5
npm install --production
npm start
```

To keep the API running permanently, use tools like [`forever`](https://github.com/foreverjs/forever#forever) or [`systemd`](https://wiki.debian.org/systemd).


## Contributing

If you have a question or have difficulties using `vbb-rest`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/vbb-rest/issues).
