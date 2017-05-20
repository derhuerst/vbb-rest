# Berlin & Brandenburg Public Transport API

**The public endpoint is [`vbb.transport.rest`](`https://vbb.transport.rest`).** This API returns data in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

In December of 2016, VBB changed all station ids, e.g. `9012103` -> `900000012103`. **This API accepts both by trying to translate old ids into new ones**, using [`vbb-translate-ids`](https://github.com/derhuerst/vbb-translate-ids). Unfortunately they only use the the new ids for *static* data (of stations), but not for POIs and in their API. **As they plan to fully migrate to the new ids, please us them from now on.**

*Note:* During development and test runs using this API, please send an **`X-Identifier` header (e.g. `my-module-testing`) to let me know the request is not from a production system**. For all other requests, a hash of the client IP will be logged. (To do this with [`vbb-client`](https://github.com/derhuerst/vbb-client), pass an `identifier` key in the query object.)

## `GET /stations?query=…`

Passes all parameters into [`vbb-stations-autocomplete`](https://github.com/derhuerst/vbb-stations-autocomplete).

- `query`: **Required.**
- `completion`: `true`/`false` – Default is `true`
- `fuzzy`: `true`/`false` – Default is `false`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://vbb.transport.rest/stations?query=jungfernheide'
# note the typo
curl 'https://vbb.transport.rest/stations?query=mehrigndamm&fuzzy=true'
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
curl 'https://vbb.transport.rest/stations?weight=9120&coordinates.latitude=52.493575'
```


## `GET /stations/all`

Dumps `full.json` from [`vbb-stations`](https://github.com/derhuerst/vbb-stations).

`Content-Type`: `application/json`

### examples

```shell
curl 'https://vbb.transport.rest/stations/all'
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
curl 'https://vbb.transport.rest/stations/nearby?latitude=52.52725&longitude=13.4123'
```


## `GET /stations/:id`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://vbb.transport.rest/stations/900000013102'
```


## `GET /stations/:id/departures`

Output from [`require('vbb-hafas').departures(…)`](https://github.com/derhuerst/vbb-hafas/blob/master/docs/departures.md).

- `when`: A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) or anything parsable by [`parse-messy-time`](https://github.com/substack/parse-messy-time#example). Default: now.
- `direction`: Station ID.
- `duration`: Show departures for the next `n` minutes. Default: `10`.

`Content-Type`: `application/json`

### examples

```shell
curl 'https://vbb.transport.rest/stations/900000013102/departures?when=tomorrow%206pm'
```


## `GET /lines`

- `variants`: Wether to return stations of the line. Default: `false`.

Passes all parameters into [`vbb-lines`](https://github.com/derhuerst/vbb-lines):

- `id`: Filter by ID.
- `name`: Filter by name.
- `operator`: Filter by operator id. See [`agency.txt`](https://vbb-gtfs.jannisr.de/latest/agency.txt).
- `mode`: Filter by mode of transport as in [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).
- `product`: See [`vbb-util`](https://github.com/derhuerst/vbb-util/blob/cd0c74f8a851549cfb9cf561d1fcf366248557c3/products.js#L116-L125).

`Content-Type`: `application/x-ndjson`

### examples

```shell
curl 'https://vbb.transport.rest/lines?operator=796&variants=true'
```


## `GET /lines/:id`

`Content-Type`: `application/json`

### examples

```shell
curl 'https://vbb.transport.rest/lines/531'
```


## `GET /shapes/:id`

`Content-Type`: `application/json`

Output from [`require('vbb-shapes')(id)`](https://github.com/derhuerst/vbb-shapes#usage).

### examples

```shell
curl 'https://vbb.transport.rest/shapes/1269'
```


## `GET /journeys`

Output from [`require('vbb-hafas').journeys(…)`](https://github.com/derhuerst/vbb-hafas#getting-started). Start location and end location must be either in [station format](#station-format) or in [POI/address format](#poiaddress-format) (you can mix them).

## station format

- `from`: **Required.** Station ID (e.g. `900000023201`).
- `to`: **Required.** Station ID (e.g. `900000023201`).

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
- `bike`: Return only bike-friendly journeys. Default: `false`.

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
curl 'https://vbb.transport.rest/journeys?from=900000017104&to=900000017101'
curl 'https://vbb.transport.rest/journeys?from=900000023201&to.name=ATZE%20Musiktheater&to.latitude=52.543333&to.longitude=13.351686'
curl 'https://vbb.transport.rest/journeys?from=…&to=…&results=3&bus=false'
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
curl 'https://vbb.transport.rest/locations?query=Alexanderplatz'
curl 'https://vbb.transport.rest/locations?query=Pestalozzistra%C3%9Fe%2082%2C%20Berlin&poi=false&stations=false'
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
curl -L -o bvg-tram-map.pdf 'https://vbb.transport.rest/maps/bvg-tram'
```


## `GET /logos/:type`

Serves the [logos from `derhuers/vbb-logos#v2`](https://github.com/derhuerst/vbb-logos/blob/v2/readme.md#available-logos).

### examples

```shell
curl -L -o tram.svg 'https://vbb.transport.rest/logos/tram.svg'
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
curl 'https://vbb.transport.rest/radar?north=52.52411&west=13.41002&south=52.51942&east=13.41709'
```
