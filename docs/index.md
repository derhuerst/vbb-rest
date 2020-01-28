# Berlin & Brandenburg Public Transport API

**The public endpoint is [`3.vbb.transport.rest`](`https://3.vbb.transport.rest/`).** This API returns data in the [*Friendly Public Transport Format* `1.2.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.2.1/spec/readme.md). Use [`vbb-client@3`](https://github.com/derhuerst/vbb-client) to talk to this API from JavaScript.

## all routes

- [`GET /stops?query=…`](#get-stopsquery)
- [`GET /stops`](#get-stops)
- [`GET /stops/nearby`](#get-stopsnearby)
- [`GET /stops/all`](#get-stopsall)
- [`GET /stops/:id`](#get-stopsid)
- [`GET /stops/:id/departures`](#get-stopsiddepartures)
- [`GET /lines`](#get-lines)
- [`GET /lines/:id`](#get-linesid)
- [`GET /shapes/:id`](#get-shapesid)
- [`GET /journeys`](#get-journeys)
- [`GET /journeys/legs/:ref`](#get-journeyslegsref)
- [`GET /trips/:id`](#get-tripsid)
- [`GET /locations`](#get-locations)
- [`GET /radar`](#get-radar)
- [`GET /maps/:type`](#get-mapstype)
- [`GET /logos/:type`](#get-logostype)

## `GET /stops?query=…`

Passes all parameters into [`vbb-stations-autocomplete`](https://github.com/derhuerst/vbb-stations-autocomplete).

- `query`: **Required.**
- `completion`: `true`/`false` – Default is `true`
- `fuzzy`: `true`/`false` – Default is `false`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://3.vbb.transport.rest/stops?query=jungfernheide'
# note the typo
curl 'https://3.vbb.transport.rest/stops?query=mehrigndamm&fuzzy=true'
```


## `GET /stops`

Passes all parameters into [`vbb-stations`](https://github.com/derhuerst/vbb-stations).

- `id`: Filter by ID.
- `name`: Filter by name.
- `coordinates.latitude`: Filter by latitude.
- `coordinates.longitude`: Filter by longitude.
- `weight`: Filter by weight.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://3.vbb.transport.rest/stops?weight=9120&coordinates.latitude=52.493575'
```


## `GET /stops/all`

Dumps `full.json` from [`vbb-stations`](https://github.com/derhuerst/vbb-stations).

`Content-Type`: `application/json`

### examples

```shell
curl 'https://3.vbb.transport.rest/stops/all'
```


## `GET /stops/nearby`

- `latitude`: **Required.**
- `longitude`: **Required.**
- `results`: How many stops/stations shall be shown? Default: `8`.
- `distance`: Maximum distance in meters. Default: `null`.
- `stops`: Show stops/stations around. Default: `true`.
- `poi`: Show points of interest around. Default: `false`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://3.vbb.transport.rest/stops/nearby?latitude=52.52725&longitude=13.4123'
```


## `GET /stops/:id`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://3.vbb.transport.rest/stops/900000013102'
```


## `GET /stops/:id/departures`

Returns departures at a stop/station. Output from `require('vbb-hafas').journeys(…)`.

*Note:* As stated in the [*Friendly Public Transport Format* `1.2.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.2.1/spec/readme.md), the returned `departure` and `arrival` times include the current delay.

- `when`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
- `direction`: Stop/station ID with a direction. Default: `null`.
- `duration`: Show departures for the next `n` minutes. Default: `10`.

`Content-Type`: `application/json`

### examples

```shell
# at U Kottbusser Tor, in direction U Görlitzer Bahnhof
curl 'https://3.vbb.transport.rest/stops/900000013102/departures?direction=900000014101'
# at U Kottbusser Tor, without direction
curl 'https://3.vbb.transport.rest/stops/900000013102/departures?when=tomorrow%206pm&results=3'
```


## `GET /lines`

Passes all parameters into [`vbb-lines`](https://github.com/derhuerst/vbb-lines):

- `id`: Filter by ID.
- `name`: Filter by name.
- `operator`: Filter by operator id. See [`agency.txt`](https://vbb-gtfs.jannisr.de/latest/agency.txt).
- `variants`: Wether to return stops/stations of the line. Default: `false`.
- `mode`: Filter by mode of transport as in [*Friendly Public Transport Format* `1.2.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.2.1/spec/readme.md).
- `product`: See [the products in `hafas-client`](https://github.com/public-transport/hafas-client/blob/4/p/vbb/products.js).

`Content-Type`: [`application/x-ndjson`](http://ndjson.org/)

### examples

```shell
curl 'https://3.vbb.transport.rest/lines?operator=796&variants=true'
```


## `GET /lines/:id`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://3.vbb.transport.rest/lines/531'
```


## `GET /shapes/:id`

`Content-Type`: `application/json`

Output from [`require('vbb-shapes')(id)`](https://github.com/derhuerst/vbb-shapes#usage).

### examples

```shell
curl 'https://3.vbb.transport.rest/shapes/1269'
```


## `GET /journeys`

Output from [`require('vbb-hafas').journeys(…)`](https://github.com/derhuerst/vbb-hafas#getting-started). Start location and end location must be either in [stop format](#stop-format) or in [POI/address format](#poiaddress-format) (you can mix them).

*Note:* As stated in the [*Friendly Public Transport Format* `1.2.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.2.1/spec/readme.md), the returned `departure` and `arrival` times include the current delay.

## stop format

- `from`: **Required.** stop/station ID (e.g. `900000023201`).
- `to`: **Required.** stop/station ID (e.g. `900000023201`).

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
- `via`: stop/station ID. Default: `null`.
- `passedStations`: Return stops/stations on the way? Default: `false`.
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
curl 'https://3.vbb.transport.rest/journeys?from=900000017104&to=900000017101'
curl 'https://3.vbb.transport.rest/journeys?from=900000023201&to.id=900980720&to.name=ATZE%20Musiktheater&to.latitude=52.543333&to.longitude=13.351686'
curl 'https://3.vbb.transport.rest/journeys?from=…&to=…&results=3&bus=false&tickets=true'
```


## `GET /trips/:id`

Output from [`require('hafas-client').trip(…)`](https://github.com/public-transport/hafas-client/blob/4/docs/trip.md#tripid-linename-opt).

- `lineName`: **Required.** Line name of the part's mode of transport, e.g. `RE7`.
- `when`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.

`Content-Type`: `application/json`

### examples

```shell
# This won't work, get a new trip ID from a journey leg first.
curl 'https://3.vbb.transport.rest/trips/1|32082|1|86|26062017?lineName=RE7'
```


## `GET /trips/:id`

Output from [`hafas.trip(…)`](https://github.com/public-transport/hafas-client/blob/4/docs/trip.md).

- `lineName`: **Required.** Line name of the part's mode of transport, e.g. `RE7`.
- `stopovers`: Return stations on the way? Default: `true`.
- `remarks`: Parse & expose hints & warnings? Default: `true`.
- `polyline`: Return a shape for the trip? Default: `false`.
- `language`: Language of the results. Default: `en`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://your-api-endpoint/trips/1|32082|1|86|26062017?lineName=RE7'
```


## `GET /locations`

Output from [`require('hafas-client').locations(…)`](https://github.com/public-transport/hafas-client/blob/4/docs/locations.md).

- `query`: **Required.** (e.g. `Alexanderplatz`)
- `results`: How many stops/stations shall be shown? Default: `10`.
- `stops`: Show stops/stations? Default: `true`.
- `poi`: Show points of interest? Default: `true`.
- `addresses`: Show addresses? Default: `true`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://3.vbb.transport.rest/locations?query=Alexanderplatz'
curl 'https://3.vbb.transport.rest/locations?query=Pestalozzistra%C3%9Fe%2082%2C%20Berlin&poi=false&stops=false'
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
curl 'https://3.vbb.transport.rest/radar?north=52.52411&west=13.41002&south=52.51942&east=13.41709'
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
curl -L -o bvg-tram-map.pdf 'https://3.vbb.transport.rest/maps/bvg-tram'
```


## `GET /logos/:type`

Serves the [logos from `derhuers/vbb-logos#v2`](https://github.com/derhuerst/vbb-logos/blob/v2/readme.md#available-logos).

### examples

```shell
curl -L -o tram.svg 'https://3.vbb.transport.rest/logos/tram.svg'
```
