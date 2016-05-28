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

- `latitude`: **Required.**
- `longitude`: **Required.**
- `results`: How many stations shall be shown? Default: `8`.
- `distance`: Maximum distance in meters. Default: `null`.
- `stations`: Show stations around. Default: `true`.
- `poi`: Show points of interest around. Default: `false`.

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

- `variants`: Wether to return stations of the line. Default: `false`.

Passes these parameters into [`vbb-lines`](https://github.com/derhuerst/vbb-lines):

- `name`: Filter by name.
- `agencyId`: Filter by agency id. See [`vbb-gtfs`](https://github.com/derhuerst/vbb-gtfs/blob/master/agency.txt).
- `type`: Filter by type. See [`vbb-util`](https://github.com/derhuerst/vbb-util/blob/cd0c74f8a851549cfb9cf561d1fcf366248557c3/products.js#L116-L125).

`Content-Type`: `application/x-ndjson`


## `GET /lines/:id`

`Content-Type`: `application/json`


## `GET /routes`

Output from [`require('vbb-hafas').routes(…)`](https://github.com/derhuerst/vbb-hafas#getting-started).

- `from`: **Required.** Station ID.
- `to`: **Required.** Station ID.
- `when`: Anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
- `results`: Maximum number of results. Default: `5`.
- `via`: Station ID. Default: `null`.
- `passedStations`: Return stations on the way? Default: `false`.
- `transfers`: Maximum number of transfers. Default: `5`.
- `transferTime`: Minimum time in minutes for a single transfer. Default: `0`.
- `accessibility`: Possible values: `partial`, `complete`. Default: `none`.
- `bike`: Return only bike-friendly routes. Default: `false`.

- `suburban`: Include [S-Bahn trains](https://en.wikipedia.org/wiki/Berlin_S-Bahn)? Default: `true`.
- `subway`: Include [U-Bahn trains](https://en.wikipedia.org/wiki/Berlin_U-Bahn)? Default: `true`.
- `tram`: Include [trams](https://en.wikipedia.org/wiki/Trams_in_Berlin)? Default: `true`.
- `bus`: Include [buses](https://en.wikipedia.org/wiki/Bus_transport_in_Berlin)? Default: `true`.
- `ferry`: Include [ferries](https://en.wikipedia.org/wiki/Ferry_transport_in_Berlin)? Default: `true`.
- `express`: Include [IC/ICE/EC trains](https://en.wikipedia.org/wiki/High-speed_rail_in_Germany)? Default: `true`.
- `regional`: Include [RE/RB/ODEG trains](https://de.wikipedia.org/wiki/Liste_der_Eisenbahnlinien_in_Brandenburg_und_Berlin#Regionalverkehr)? Default: `true`.

`Content-Type`: `application/json`
