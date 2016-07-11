# API

**The public endpoint is [`transport.rest`](`https://transport.rest`).**

*Note:* During development and test runs using this API, please send an **`X-Identifier` header (e.g. `my-module-testing`) to let me know the request is not from a production system**. For all other requests, a hash of the client IP will be logged.

## `GET /stations?query=…`

If `completion=true`, [`vbb-stations-autocomplete`](https://github.com/derhuerst/vbb-stations-autocomplete) will be used. The `Content-Type` will be `application/json`.

Otherwise, [`vbb-find-stations`](https://github.com/derhuerst/vbb-find-stations) will be used. The `Content-Type` will be `application/x-ndjson`.

### examples

```shell
curl 'https://transport.rest/stations?completion=true&query=jungfernhei'
curl 'https://transport.rest/stations?query=jungfernheide'
```


## `GET /stations`

Passes all parameters into [`vbb-stations`](https://github.com/derhuerst/vbb-stations).

- `name`: Filter by name.
- `latitude`: Filter by latitude.
- `longitude`: Filter by longitude.
- `weight`: Filter by weight.

`Content-Type`: `application/x-ndjson`

### examples

```shell
curl 'https://transport.rest/stations?weight=33660'
```


## `GET /stations/nearby`

- `latitude`: **Required.**
- `longitude`: **Required.**
- `results`: How many stations shall be shown? Default: `8`.
- `distance`: Maximum distance in meters. Default: `null`.
- `stations`: Show stations around. Default: `true`.
- `poi`: Show points of interest around. Default: `false`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://transport.rest/stations/nearby?latitude=52.52725&longitude=13.4123'
```


## `GET /stations/:id`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://transport.rest/stations/9013102'
```


## `GET /stations/:id/departures`

Output from [`require('vbb-hafas').departures(…)`](https://github.com/derhuerst/vbb-hafas/blob/master/docs/departures.md).

- `when`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
- `direction`: Station ID.
- `duration`: Show departures for the next `n` minutes. Default: `10`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://transport.rest/stations/9013102/departures?when=tomorrow%206pm'
```


## `GET /lines`

- `variants`: Wether to return stations of the line. Default: `false`.

Passes these parameters into [`vbb-lines`](https://github.com/derhuerst/vbb-lines):

- `name`: Filter by name.
- `agencyId`: Filter by agency id. See [`vbb-gtfs`](https://github.com/derhuerst/vbb-gtfs/blob/master/agency.txt).
- `type`: Filter by type. See [`vbb-util`](https://github.com/derhuerst/vbb-util/blob/cd0c74f8a851549cfb9cf561d1fcf366248557c3/products.js#L116-L125).

`Content-Type`: `application/x-ndjson`

### examples

```shell
curl 'https://transport.rest/lines?agencyId=BVT'
```


## `GET /lines/:id`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://transport.rest/lines/531'
```


## `GET /routes`

Output from [`require('vbb-hafas').routes(…)`](https://github.com/derhuerst/vbb-hafas#getting-started). Start location and end location must be either in [station format](#station-format) or in [POI/address format](#poiaddress-format) (you can mix them).

## station format

- `from`: **Required.** Station ID (e.g. `9023201`).
- `to`: **Required.** Station ID (e.g. `9023201`).

## POI/address format

- `from.latitude`/`to.latitude`: **Required.** Latitude (e.g. `52.543333`).
- `from.longitude`/`to.longitude`: **Required.** Longitude (e.g. `13.351686`).
- `from.name`/`to.name`: Name of the locality (e.g. `ATZE Musiktheater`).
- `from.id`/`to.id`: POI ID (e.g. `9980720`).

## other parameters

- `when`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
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

### examples

```shell
curl 'https://transport.rest/routes?from=9017104&to=9017101'
curl 'https://transport.rest/routes?from=9023201&to.name=ATZE%20Musiktheater&to.latitude=52.543333&to.longitude=13.351686'
curl 'https://transport.rest/routes?from=…&to=…&results=3&bus=false'
```


## `GET /locations`

Output from [`require('vbb-hafas').locations(…)`](https://github.com/derhuerst/vbb-hafas/blob/master/docs/locations.md)

- `query`: **Required.** (e.g. `Alexanderplatz`)
- `results`: How many stations shall be shown? Default: `10`.
- `stations`: Show stations? Default: `true`.
- `poi`: Show points of interest? Default: `true`.
- `addresses`: Show addresses? Default: `true`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://transport.rest/locations?query=Alexanderplatz'
curl 'https://transport.rest/locations?query=Pestalozzistra%C3%9Fe%2082%2C%20Berlin&poi=false&stations=false'
```


## `GET /maps/:type`

Redirects to PDF public transport maps. `type` may be one of these:

`type` | Description
-------|------------
`bvg` | Day, **Berlin ABC**, S-Bahn & U-Bahn
`bvg-tram` | Day & Night, **Berlin ABC**, Trams
`bvg-night` | Night, **Berlin ABC**, S-Bahn & U-Bahn
`bvg-refugees` | Day, **Berlin-ABC**, S-Bahn & U-Bahn, Translations
`vbb` | Day, **Berlin & Brandenburg**, RE & RB trains
`brb` | Day, **Brandenburg an der Havel**
`cb` | Day & Night, **Cottbus**
`cb-night` | Night, **Cottbus**
`ff` | Day, **Frankfurt Oder**
`p` | Day, **Potsdam**
`p-night` | Night, **Potsdam**

### examples

```shell
curl -L -o bvg-tram-map.pdf 'https://transport.rest/maps/bvg-tram'
```


## `GET /logos/:type`

Serves the [logos from `derhuers/vbb-logos#v2`](https://github.com/derhuerst/vbb-logos/blob/v2/readme.md#available-logos).

### examples

```shell
curl -L -o tram.svg 'https://transport.rest/logos/tram.svg'
```
