# *vbb-rest*

***vbb-rest* is a public transport REST API**, a clean alternative to the [VBB HAFAS API](https://github.com/derhuerst/vbb-hafas). Things you don't get with their API:

- CORS
- HTTPS
- speed!
- completely REST
- nearby stations API
- sane, transparent rate-limiting

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

**The public endpoint is [`vbb-rest.do.jannisr.de`](`https://vbb-rest.do.jannisr.de`).**

You can pass your own VBB API key with an `x-vbb-api-key` HTTP header.


### `GET /stations?query=…`

- `completion=true`: Use [`vbb-stations-autocomplete`](https://github.com/derhuerst/vbb-stations-autocomplete). Otherwise, [`vbb-find-stations`](https://github.com/derhuerst/vbb-find-stations) will be used.

`Content-Type`: `application/x-ndjson` if `completion=true`, otherwise `application/json`

`X-Rate-Limit`: `1000` (per hour)


### `GET /stations`

Passes all parameters into [`vbb-stations`](https://github.com/derhuerst/vbb-stations).

- `name=…`: Filter by name.
- `latitude=…`: Filter by latitude.
- `longitude=…`: Filter by longitude.
- `weight=…`: Filter by weight.

`Content-Type`: `application/x-ndjson`

`X-Rate-Limit`: `1000` (per hour)


### `GET /stations/nearby`

*Note:* This route calculates the *map* distance, not the *walking* distance!

- `latitude=…`: **Required.**
- `longitude=…`: **Required.**
- `results=…`: How many stations shall be shown?

`Content-Type`: `application/x-ndjson`

`X-Rate-Limit`: `1000` (per hour)


### `GET /stations/:id`

`Content-Type`: `application/json`

`X-Rate-Limit`: `1000` (per hour)


### `GET /stations/:id/departures`

Output from [`require('vbb-hafas').departures(…)`](https://github.com/derhuerst/vbb-hafas#getting-started).

`Content-Type`: `application/json`

`X-Rate-Limit`: `250` (per hour)


### `GET /lines`

Passes all parameters into [`vbb-lines`](https://github.com/derhuerst/vbb-lines).

- `name=…`: Filter by name.
- `agencyId=…`: Filter by agency id. See [`vbb-static`](https://github.com/derhuerst/vbb-static).
- `type=…`: Filter by type. See [`vbb-util`](https://github.com/derhuerst/vbb-util/blob/cd0c74f8a851549cfb9cf561d1fcf366248557c3/products.js#L116-L125).

`Content-Type`: `application/x-ndjson`

`X-Rate-Limit`: `1000` (per hour)


### `GET /lines/:id`

`Content-Type`: `application/json`

`X-Rate-Limit`: `1000` (per hour)


### `GET /routes`

- `from=…`: **Required.** Station ID.
- `to=…`: **Required.** Station ID.

Output from [`require('vbb-hafas').routes(…)`](https://github.com/derhuerst/vbb-hafas#getting-started).

`Content-Type`: `application/json`

`X-Rate-Limit`: `100` (per hour)


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-rest/issues).
