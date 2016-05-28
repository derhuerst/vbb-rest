# API

## `GET /stations?query=…`

- `completion=true`: Use [`vbb-stations-autocomplete`](https://github.com/derhuerst/vbb-stations-autocomplete). Otherwise, [`vbb-find-stations`](https://github.com/derhuerst/vbb-find-stations) will be used.

`Content-Type`: `application/x-ndjson` if `completion=true`, otherwise `application/json`


## `GET /stations`

Passes all parameters into [`vbb-stations`](https://github.com/derhuerst/vbb-stations).

- `name=…`: Filter by name.
- `latitude=…`: Filter by latitude.
- `longitude=…`: Filter by longitude.
- `weight=…`: Filter by weight.

`Content-Type`: `application/x-ndjson`


## `GET /stations/nearby`

*Note:* This route calculates the *map* distance, not the *walking* distance!

- `latitude=…`: **Required.**
- `longitude=…`: **Required.**
- `results=…`: How many stations shall be shown?

`Content-Type`: `application/x-ndjson`


## `GET /stations/:id`

`Content-Type`: `application/json`


## `GET /stations/:id/departures`

Output from [`require('vbb-hafas').departures(…)`](https://github.com/derhuerst/vbb-hafas/blob/master/docs/departures.md).

- `when=…`: Anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
- `direction=…`: Station ID.
- `duration=…`: Show departures for the next `n` minutes. Default: `10`.

`Content-Type`: `application/json`


## `GET /lines`

Passes all parameters into [`vbb-lines`](https://github.com/derhuerst/vbb-lines).

- `name=…`: Filter by name.
- `agencyId=…`: Filter by agency id. See [`vbb-static`](https://github.com/derhuerst/vbb-static).
- `type=…`: Filter by type. See [`vbb-util`](https://github.com/derhuerst/vbb-util/blob/cd0c74f8a851549cfb9cf561d1fcf366248557c3/products.js#L116-L125).

`Content-Type`: `application/x-ndjson`


## `GET /lines/:id`

`Content-Type`: `application/json`


## `GET /routes`

- `from=…`: **Required.** Station ID.
- `to=…`: **Required.** Station ID.

Output from [`require('vbb-hafas').routes(…)`](https://github.com/derhuerst/vbb-hafas#getting-started).

`Content-Type`: `application/json`
