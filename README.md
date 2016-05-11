# *vbb-rest*

[![Join the chat at https://gitter.im/derhuerst/vbb-rest](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst/vbb-rest?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

***vbb-rest* is a public transport REST API**, a clean alternative to the [VBB HAFAS API](https://github.com/derhuerst/vbb-hafas).

[![npm version](https://img.shields.io/npm/v/vbb-rest.svg)](https://www.npmjs.com/package/vbb-rest)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-rest.svg)](https://david-dm.org/derhuerst/vbb-rest)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-rest.svg)
[![gitter channel](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst/vbb-rest)


## Installing

Install & run [Redis](http://redis.io/)

```
git clone https://github.com/derhuerst/vbb-rest.git
cd vbb-rest
npm install --production
npm start
```


## Usage

### `GET /stations`

- `completion=true`: Use [`vbb-stations-autocomplete`](https://github.com/derhuerst/vbb-stations-autocomplete). Otherwise, [`vbb-find-stations`](https://github.com/derhuerst/vbb-find-stations) will be used.
- `query=…`: **Required.**

`Content-Type`: `application/x-ndjson` if `completion=true`, otherwise `application/json`
`X-Rate-Limit`: `1000` (per hour)

### `GET /stations/:id/departures`

Output from [`require('vbb-hafas').departures(…)`](https://github.com/derhuerst/vbb-hafas#getting-started).

`Content-Type`: `application/json`
`X-Rate-Limit`: `250` (per hour)

### `GET /routes`

- `from=…`: **Required.** Station ID.
- `to=…`: **Required.** Station ID.

Output from [`require('vbb-hafas').routes(…)`](https://github.com/derhuerst/vbb-hafas#getting-started).

`Content-Type`: `application/json`
`X-Rate-Limit`: `100` (per hour)


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-rest/issues).
