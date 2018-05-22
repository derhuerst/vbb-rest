# Berlin & Brandenburg Public Transport API

**The public endpoint is [`2.vbb.transport.rest`](`https://2.vbb.transport.rest/`).** This API returns data in the [*Friendly Public Transport Format* `1.0.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.0.1/spec/readme.md). Use [`vbb-client@3`](https://github.com/derhuerst/vbb-client) to talk to this API from JavaScript.

*Note:* In order to improve this API, I would to know which software projects use it. Please send an **`X-Identifier` header (e.g. `my-awesome-tool`) to let me know who you are**.

## all routes

- [`GET /stations?query=…`](#get-stationsquery)
- [`GET /stations`](#get-stations)
- [`GET /stations/nearby`](#get-stationsnearby)
- [`GET /stations/all`](#get-stationsall)
- [`GET /stations/:id`](#get-stationsid)
- [`GET /stations/:id/departures`](#get-stationsiddepartures)
- [`GET /lines`](#get-lines)
- [`GET /lines/:id`](#get-linesid)
- [`GET /shapes/:id`](#get-shapesid)
- [`GET /journeys`](#get-journeys)
- [`GET /journeys/legs/:ref`](#get-journeyslegsref)
- [`GET /locations`](#get-locations)
- [`GET /radar`](#get-radar)
- [`GET /maps/:type`](#get-mapstype)
- [`GET /logos/:type`](#get-logostype)

## `GET /stations?query=…`

Passes all parameters into [`vbb-stations-autocomplete`](https://github.com/derhuerst/vbb-stations-autocomplete).

- `query`: **Required.**
- `completion`: `true`/`false` – Default is `true`
- `fuzzy`: `true`/`false` – Default is `false`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://2.vbb.transport.rest/stations?query=jungfernheide'
# note the typo
curl 'https://2.vbb.transport.rest/stations?query=mehrigndamm&fuzzy=true'
```


## `GET /stations`

Passes all parameters into [`vbb-stations`](https://github.com/derhuerst/vbb-stations).

- `id`: Filter by ID.
- `name`: Filter by name.
- `coordinates.latitude`: Filter by latitude.
- `coordinates.longitude`: Filter by longitude.
- `weight`: Filter by weight.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://2.vbb.transport.rest/stations?weight=9120&coordinates.latitude=52.493575'
```


## `GET /stations/all`

Dumps `full.json` from [`vbb-stations`](https://github.com/derhuerst/vbb-stations).

`Content-Type`: `application/json`

### examples

```shell
curl 'https://2.vbb.transport.rest/stations/all'
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
curl 'https://2.vbb.transport.rest/stations/nearby?latitude=52.52725&longitude=13.4123'
```


## `GET /stations/:id`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://2.vbb.transport.rest/stations/900000013102'
```


## `GET /stations/:id/departures`

Returns departures at a station. To maintain backwards compatibility, this route has two modes of operation (see below).

*Note:* As stated in the [*Friendly Public Transport Format* `1.0.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.0.1/spec/readme.md), the returned `departure` and `arrival` times include the current delay.

`Content-Type`: `application/json`

### with `nextStation`

**If you provide a station ID with the `nextStation` parameter, [`hafas-departures-in-direction`](https://github.com/derhuerst/hafas-departures-in-direction#usage) will be used to filter by direction.** Only departures with this station as their *next* stop will be returned.

You may then add these parameters:

- `when`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
- `results`: The number of results. Lower means faster. Default: `10`.
- `maxQueries`: The maximum number of queries against VBB. Default: `10`.

### without `nextStation`

**If you *do not* use `nextStation`, `departures(…)` from [`vbb-hafas`](https://github.com/derhuerst/vbb-hafas#vbb-hafas) (which uses [`departures(…)` from `hafas-client`](https://github.com/public-transport/hafas-client/blob/any-endpoint/docs/departures.md#departuresstation-opt)) will be used to get departures in *all* directions.**

You may then add these parameters:

- `when`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
- `duration`: Show departures for the next `n` minutes. Default: `10`.

### examples

```shell
# at U Kottbusser Tor, in direction U Görlitzer Bahnhof
curl 'https://2.vbb.transport.rest/stations/900000013102/departures?nextStation=900000014101&results=3'
# at U Kottbusser Tor, without direction
curl 'https://2.vbb.transport.rest/stations/900000013102/departures?when=tomorrow%206pm'
```


## `GET /lines`

Passes all parameters into [`vbb-lines`](https://github.com/derhuerst/vbb-lines):

- `id`: Filter by ID.
- `name`: Filter by name.
- `operator`: Filter by operator id. See [`agency.txt`](https://vbb-gtfs.jannisr.de/latest/agency.txt).
- `variants`: Wether to return stations of the line. Default: `false`.
- `mode`: Filter by mode of transport as in [*Friendly Public Transport Format* `1.0.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.0.1/spec/readme.md).
- `product`: See [the products in `hafas-client`](https://github.com/public-transport/hafas-client/blob/95151ccd0ef1ef7d9ce6d9a80f66a0300c67e54a/p/vbb/modes.js#L5-L75).

`Content-Type`: [`application/x-ndjson`](http://ndjson.org/)

### examples

```shell
curl 'https://2.vbb.transport.rest/lines?operator=796&variants=true'
```


## `GET /lines/:id`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://2.vbb.transport.rest/lines/531'
```


## `GET /shapes/:id`

`Content-Type`: `application/json`

Output from [`require('vbb-shapes')(id)`](https://github.com/derhuerst/vbb-shapes#usage).

### examples

```shell
curl 'https://2.vbb.transport.rest/shapes/1269'
```


## `GET /journeys`

Output from [`require('vbb-hafas').journeys(…)`](https://github.com/derhuerst/vbb-hafas#getting-started). Start location and end location must be either in [station format](#station-format) or in [POI/address format](#poiaddress-format) (you can mix them).

*Note:* As stated in the [*Friendly Public Transport Format* `1.0.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.0.1/spec/readme.md), the returned `departure` and `arrival` times include the current delay.

## station format

- `from`: **Required.** Station ID (e.g. `900000023201`).
- `to`: **Required.** Station ID (e.g. `900000023201`).

## POI format

- `from.latitude`/`to.latitude`: **Required.** Latitude (e.g. `52.543333`).
- `from.longitude`/`to.longitude`: **Required.** Longitude (e.g. `13.351686`).
- `from.name`/`to.name`: Name of the locality (e.g. `Atze Musiktheater`).
- `from.id`/`to.id`: **Required.** POI ID (e.g. `9980720`).

## address format

- `from.latitude`/`to.latitude`: **Required.** Latitude (e.g. `52.543333`).
- `from.longitude`/`to.longitude`: **Required.** Longitude (e.g. `13.351686`).
- `from.address`/`to.address`: **Required.** Address (e.g. `Voltastr. 17`).

## other parameters

- `when`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
- `results`: Maximum number of results. Default: `5`.
- `via`: Station ID. Default: `null`.
- `passedStations`: Return stations on the way? Default: `false`.
- `transfers`: Maximum number of transfers. Default: `5`.
- `transferTime`: Minimum time in minutes for a single transfer. Default: `0`.
- `accessibility`: Possible values: `partial`, `complete`. Default: `none`.
- `bike`: Return only bike-friendly journeys. Default: `false`.
- `tickets`: Return information about available tickets. Default: `false`.
- `transferInfo`: Try to add transfer information from [`vbb-change-positions`](https://github.com/juliuste/vbb-change-positions) to journey legs? [more details](https://github.com/derhuerst/vbb-hafas/blob/master/README.md#transfer-information-for-journeys) Default: `false`.

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
curl 'https://2.vbb.transport.rest/journeys?from=900000017104&to=900000017101'
curl 'https://2.vbb.transport.rest/journeys?from=900000023201&to.name=ATZE%20Musiktheater&to.latitude=52.543333&to.longitude=13.351686'
curl 'https://2.vbb.transport.rest/journeys?from=…&to=…&results=3&bus=false&tickets=true'
```


## `GET /journeys/legs/:ref`

Output from [`require('hafas-client').journeyLeg(…)`](https://github.com/public-transport/hafas-client/blob/master/docs/journey-leg.md#journeylegref-linename-opt).

- `lineName`: **Required.** Line name of the part's mode of transport, e.g. `RE7`.
- `when`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.

`Content-Type`: `application/json`

### examples

```shell
# this won't work, get a new ref from /journeys first
curl 'https://2.vbb.transport.rest/journeys/legs/1|32082|1|86|26062017?lineName=RE7'
```


## `GET /locations`

Output from [`require('hafas-client').locations(…)`](https://github.com/public-transport/hafas-client/blob/master/docs/locations.md).

- `query`: **Required.** (e.g. `Alexanderplatz`)
- `results`: How many stations shall be shown? Default: `10`.
- `stations`: Show stations? Default: `true`.
- `poi`: Show points of interest? Default: `true`.
- `addresses`: Show addresses? Default: `true`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://2.vbb.transport.rest/locations?query=Alexanderplatz'
curl 'https://2.vbb.transport.rest/locations?query=Pestalozzistra%C3%9Fe%2082%2C%20Berlin&poi=false&stations=false'
```


## `GET /radar`

- `north`: **Required.** Northern latitude.
- `west`: **Required.** Western longtidue.
- `south`: **Required.** Southern latitude.
- `east`: **Required.** Eastern longtidue.
- `results`: How many vehicles shall be shown? Default: `256`.
- `duration`: Compute frames for how many seconds? Default: `30`.
- `frames`: Number of frames to compute. Default: `3`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://2.vbb.transport.rest/radar?north=52.52411&west=13.41002&south=52.51942&east=13.41709'
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
curl -L -o bvg-tram-map.pdf 'https://2.vbb.transport.rest/maps/bvg-tram'
```


## `GET /logos/:type`

Serves the [logos from `derhuers/vbb-logos#v2`](https://github.com/derhuerst/vbb-logos/blob/v2/readme.md#available-logos).

### examples

```shell
curl -L -o tram.svg 'https://2.vbb.transport.rest/logos/tram.svg'
```
