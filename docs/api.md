# `v5.vbb.transport.rest` API documentation

[`v5.vbb.transport.rest`](https://v5.vbb.transport.rest/) is a [REST API](https://restfulapi.net). Data is being returned as [JSON](https://www.json.org/).

You can just use the API without authentication. There's a [rate limit](https://apisyouwonthate.com/blog/what-is-api-rate-limiting-all-about) of 100 request/minute (burst 200 requests/minute) set up.

[OpenAPI playground](https://petstore.swagger.io/?url=https%3A%2F%2Fv5.vbb.transport.rest%2F.well-known%2Fservice-desc%0A)

*Note:* For [URL-encoding](https://de.wikipedia.org/wiki/URL-Encoding), this documentation uses the `url-encode` tool of the [`url-decode-encode-cli` package](https://www.npmjs.com/package/url-decode-encode-cli).


## Routes

*Note:* These routes only wrap [`hafas-client@5` methods](https://github.com/public-transport/hafas-client/blob/5/docs/readme.md), check their docs for more details.


- [`GET /stops/nearby`](#get-stopsnearby)
- [`GET /stops/reachable-from`](#get-stopsreachable-from)
- [`GET /stops/:id`](#get-stopsid)
- [`GET /stops/:id/departures`](#get-stopsiddepartures)
- [`GET /stops/:id/arrivals`](#get-stopsidarrivals)
- [`GET /journeys`](#get-journeys)
- [`GET /trips/:id`](#get-tripsid)
- [`GET /locations`](#get-locations)
- [`GET /radar`](#get-radar)
- [`GET /journeys/:ref`](#get-journeysref)
- [`GET /stations`](#get-stations)
- [`GET /stations/:id`](#get-stationsid)
- [`GET /lines`](#get-lines)
- [`GET /lines/:id`](#get-linesid)
- [`GET /shapes/:id`](#get-shapesid)
- [`GET /maps/:type`](#get-mapstype)
- [date/time parameters](#datetime-parameters)


## `GET /locations`

Uses [`hafasClient.locations()`](https://github.com/public-transport/hafas-client/blob/5/docs/locations.md) to **find stops/stations, POIs and addresses matching `query`**.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`query` | **Required.**  | string | –
`fuzzy` | Find more than exact matches? | boolean | `true`
`results` | How many stations shall be shown? | integer | `10`
`stops` | Show stops/stations? | boolean | `true`
`addresses` | Show points of interest? | boolean | `true`
`poi` | Show addresses? | boolean | `true`
`linesOfStops` | Parse & return lines of each stop/station? | boolean | `false`
`language` | Language of the results. | string | `en`

### Example

```shell
curl 'https://v5.vbb.transport.rest/locations?query=alexanderplatz&results=1' -s | jq
```

```js
[
	{
		"type": "stop",
		"id": "900000100003",
		"name": "S+U Alexanderplatz",
		"location": {
			"type": "location",
			"id": "900100003",
			"latitude": 52.521508,
			"longitude": 13.411267
		},
		"products": {
			"suburban": true,
			"subway": false,
			"tram": false,
			// …
		}
	}
]
```


## `GET /stops/nearby`

Uses [`hafasClient.nearby()`](https://github.com/public-transport/hafas-client/blob/5/docs/nearby.md) to **find stops/stations close to the given geolocation**.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`latitude` | **Required.**  | number | –
`longitude` | **Required.**  | number | –
`results` | maximum number of results | integer | `8`
`distance` | maximum walking distance in meters | integer | –
`stops` | Return stops/stations? | boolean | `true`
`poi` | Return points of interest? | boolean | `false`
`linesOfStops` | Parse & expose lines at each stop/station? | boolean | `false`
`language` | Language of the results. | string | `en`

### Example

```shell
curl 'https://v5.vbb.transport.rest/stops/nearby?latitude=52.52725&longitude=13.4123' -s | jq
```

```js
[
	{
		"type": "stop",
		"id": "900000100016",
		"name": "U Rosa-Luxemburg-Platz",
		"location": {
			"type": "location",
			"id": "900100016",
			"latitude": 52.528187,
			"longitude": 13.410405
		},
		"products": { /* … */ },
		"distance": 165
	},
	// …
	{
		"type": "stop",
		"id": "900000110005",
		"name": "U Senefelderplatz",
		"location": { /* … */ },
		"products": { /* … */ },
		"distance": 597
	},
	// …
]
```


## `GET /stops/reachable-from`

Uses [`hafasClient.reachableFrom()`](https://github.com/public-transport/hafas-client/blob/5/docs/reachable-from.md) to **find stops/stations reachable within a certain time from an address**.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`latitude` | **Required.**  | number | –
`longitude` | **Required.**  | number | –
`address` | **Required.**  | string | –
`when` | Date & time to compute the reachability for. See [date/time parameters](#datetime-parameters). | date+time | *now*
`maxTransfers` | Maximum number of transfers. | integer | `5`
`maxDuration` | Maximum travel duration, in minutes. | integer | *infinite*
`language` | Language of the results. | string | `en`
`suburban` | Include S-Bahn (S)? | boolean | `true`
`subway` | Include U-Bahn (U)? | boolean | `true`
`tram` | Include Tram (T)? | boolean | `true`
`bus` | Include Bus (B)? | boolean | `true`
`ferry` | Include Fähre (F)? | boolean | `true`
`express` | Include IC/ICE (E)? | boolean | `true`
`regional` | Include RB/RE (R)? | boolean | `true`

### Example

```shell
curl 'https://v5.vbb.transport.rest/stops/reachable-from?latitude=52.52446&longitude=13.40812&address=10178+Berlin-Mitte,+Münzstr.+12' -s | jq
```

```js
[
	{
		"duration": 4,
		"stations": [
			{
				"type": "stop",
				"id": "900000100051",
				"name": "U Weinmeisterstr.",
				"location": { /* … */ },
				"products": { /* … */ },
			}
		]
	},
	// …
	{
		"duration": 7,
		"stations": [
			{
				"type": "stop",
				"id": "900000007110",
				"name": "U Bernauer Str.",
				"location": { /* … */ },
				"products": { /* … */ }
			},
			{
				"type": "stop",
				"id": "900000100004",
				"name": "S+U Jannowitzbrücke",
				"location": { /* … */ },
				"products": { /* … */ }
			},
			// …
		]
	},
	// …
]
```


## `GET /stops/:id`

Uses [`hafasClient.stop()`](https://github.com/public-transport/hafas-client/blob/5/docs/stop.md) to **find a stop/station by ID**.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`linesOfStops` | Parse & expose lines at each stop/station? | boolean | `false`
`language` | Language of the results. | string | `en`

### Example

```shell
curl 'https://v5.vbb.transport.rest/stops/900000017101' -s | jq
```

```js
{
	"type": "stop",
	"id": "900000017101",
	"name": "U Mehringdamm",
	"location": {
		"type": "location",
		"id": "900017101",
		"latitude": 52.49357,
		"longitude": 13.388138
	},
	"products": { /* … */ },
}
```


## `GET /stops/:id/departures`

Uses [`hafasClient.departures()`](https://github.com/public-transport/hafas-client/blob/5/docs/departures.md) to **get departures at a stop/station**.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`when` | Date & time to get departures for. See [date/time parameters](#datetime-parameters). | date+time | *now*
`direction` | Filter departures by direction. | string |  
`duration` | Show departures for how many minutes? | integer | `10`
`results` | Max. number of departures. | integer | *whatever HAFAS wants
`linesOfStops` | Parse & return lines of each stop/station? | boolean | `false`
`remarks` | Parse & return hints & warnings? | boolean | `true`
`language` | Language of the results. | string | `en`
`includeRelatedStations` | Fetch departures at related stops, e.g. those that belong together on the metro map? | boolean | `true`
`stopovers` | Fetch & parse next stopovers of each departure? | boolean | `false`
`suburban` | Include S-Bahn (S)? | boolean | `true`
`subway` | Include U-Bahn (U)? | boolean | `true`
`tram` | Include Tram (T)? | boolean | `true`
`bus` | Include Bus (B)? | boolean | `true`
`ferry` | Include Fähre (F)? | boolean | `true`
`express` | Include IC/ICE (E)? | boolean | `true`
`regional` | Include RB/RE (R)? | boolean | `true`

### Example

```shell
# at U Kottbusser Tor, in direction U Görlitzer Bahnhof
curl 'https://v5.vbb.transport.rest/stops/900000013102/departures?direction=900000014101&duration=10' -s | jq
```

```js
[
	{
		"tripId": "1|61154|54|86|29042020",
		"direction": "Ersatz S+U Warschauer Str.",
		"line": {
			"type": "line",
			"id": "u1",
			"name": "U1",
			"mode": "bus",
			"product": "bus",
			// …
		},

		"when": "2020-04-29T19:31:00+02:00",
		"plannedWhen": "2020-04-29T19:30:00+02:00",
		"delay": 60,
		"platform": null,
		"plannedPlatform": null,

		"stop": {
			"type": "stop",
			"id": "900000013102",
			"name": "U Kottbusser Tor",
			"location": { /* … */ },
			"products": { /* … */ },
			// …
		},

		"remarks": [ /* … */ ],
	},
	// …
]
```


## `GET /stops/:id/arrivals`

Works like [`/stops/:id/departures`](#get-stopsiddepartures), except that it uses [`hafasClient.arrivals()`](https://github.com/public-transport/hafas-client/blob/5/docs/arrivals.md) to **arrivals at a stop/station**.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`when` | Date & time to get departures for. See [date/time parameters](#datetime-parameters). | date+time | *now*
`direction` | Filter departures by direction. | string |  
`duration` | Show departures for how many minutes? | integer | `10`
`results` | Max. number of departures. | integer | *whatever HAFAS wants*
`linesOfStops` | Parse & return lines of each stop/station? | boolean | `false`
`remarks` | Parse & return hints & warnings? | boolean | `true`
`language` | Language of the results. | string | `en`
`includeRelatedStations` | Fetch departures at related stops, e.g. those that belong together on the metro map? | boolean | `true`
`stopovers` | Fetch & parse next stopovers of each departure? | boolean | `false`
`suburban` | Include S-Bahn (S)? | boolean | `true`
`subway` | Include U-Bahn (U)? | boolean | `true`
`tram` | Include Tram (T)? | boolean | `true`
`bus` | Include Bus (B)? | boolean | `true`
`ferry` | Include Fähre (F)? | boolean | `true`
`express` | Include IC/ICE (E)? | boolean | `true`
`regional` | Include RB/RE (R)? | boolean | `true`

### Example

```shell
# at U Kottbusser Tor, 10 minutes
curl 'https://v5.vbb.transport.rest/stops/900000013102/arrivals?duration=10' -s | jq
```


## `GET /stations`

If the `query` parameter is used, it will use [`vbb-stations-autocomplete`](https://npmjs.com/package/vbb-stations-autocomplete) to autocomplete stops/stations by name. Otherwise, it will filter the stops/stations in [`vbb-stations`](https://npmjs.com/package/vbb-stations).

Instead of receiving a JSON response, you can request [newline-delimited JSON](http://ndjson.org) by sending `Accept: application/x-ndjson`.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`query` | Find stations by name using [`vbb-stations-autocomplete`](https://npmjs.com/package/vbb-stations-autocomplete). | string | –
`limit` | *If `query` is used:* Return at most `n` stations. | number | `3`
`fuzzy` | *If `query` is used:* Find stations despite typos. | boolean | `false`
`completion` | *If `query` is used:* Autocomplete stations. | boolean | `true`

### Examples

```shell
# autocomplete using vbb-stations-autocomplete
curl 'https://v5.vbb.transport.rest/stations?query=mehringd' -s | jq
```

```js
{
	"type": "station",
	"id": "900000017101",
	"name": "U Mehringdamm (Berlin)",
	"weight": 12994,
	"location": { /* … */ },
	"stops": [
		{
			"type": "stop",
			"id": "070101001002",
			"name": "U Mehringdamm (Berlin)",
			"station": "900000017101",
			"location": { /* … */ },
		},
		// …
	],
	"lines": [
		{
			"type": "line",
			"id": "17521_400",
			"name": "U6",
			"mode": "train",
			"product": "subway",
		},
		// …
	]
}
```

```shell
# filter vbb-stations
curl 'https://v5.vbb.transport.rest/stations?location.latitude=52.493567' -s | jq
```

```js
{
	"900000017101": {
		"type": "station",
		"id": "900000017101",
		"name": "U Mehringdamm (Berlin)",
		"weight": 12994,
		"location": { /* … */ },
		"stops": [ /* … */ ],
	},
	// …
}
```

```shell
# filter vbb-stations, get newline-delimited JSON
curl 'https://v5.vbb.transport.rest/stations?location.latitude=52.493567' -H 'accept: application/x-ndjson' -s | jq
```


## `GET /stations/:id`

Returns a stop/station from [`vbb-stations`](https://npmjs.com/package/vbb-stations).

### Example

```shell
# lookup U Mehringdamm
curl 'https://v5.vbb.transport.rest/stations/900000017101' -s | jq
```

```js
{
	"type": "station",
	"id": "8010159",
	"additionalIds": ["8098159"],
	"ril100": "LH",
	"nr": 2498,
	"name": "Halle (Saale) Hbf",
	"weight": 815.6,
	"location": { /* … */ },
	"operator": { /* … */ },
	"address": { /* … */ },
	"ril100Identifiers": [
		{
			"rilIdentifier": "LH",
			// …
		},
		// …
	],
	// …
}
```


## `GET /journeys`

Uses [`hafasClient.journeys()`](https://github.com/public-transport/hafas-client/blob/5/docs/journeys.md) to **find journeys from A (`from`) to B (`to`)**.

`from` (A), `to` (B), and the optional `via` must each have one of these formats:

- as stop/station ID (e.g. `from=900000017101` for *U Mehringdamm*)
- as a POI (e.g. `from.id=900980720&from.latitude=52.54333&from.longitude=13.35167` for *ATZE Musiktheater*)
- as an address (e.g. `from.latitude=52.543333&from.longitude=13.351686&from.address=Voltastr.+17` for *Voltastr. 17*)

### Pagination

Given a response, you can also fetch more journeys matching the same criteria. Instead of `from*`, `to*` & `departure`/`arrival`, pass `earlierRef` from the first response as `earlierThan` to get journeys "before", or `laterRef` as `laterThan` to get journeys "after".

Check the [`hafasClient.journeys()` docs](https://github.com/public-transport/hafas-client/blob/5/docs/journeys.md) for more details.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`departure` | Compute journeys departing at this date/time. Mutually exclusive with `arrival`. See [date/time parameters](#datetime-parameters). | date+time | *now*
`arrival` | Compute journeys arriving at this date/time. Mutually exclusive with `departure`. See [date/time parameters](#datetime-parameters). | date+time | *now*
`earlierThan` | Compute journeys "before" an `ealierRef`. | string |  
`laterThan` | Compute journeys "after" an `laterRef`. | string |  
`results` | Max. number of journeys. | integer | `3`
`stopovers` | Fetch & parse stopovers on the way? | boolean | `false`
`transfers` | Maximum number of transfers. | integer | *let HAFAS decide*
`transferTime` | Minimum time in minutes for a single transfer. | integer | `0`
`accessibility` | `partial` or `complete`. | string | *not accessible*
`bike` | Compute only bike-friendly journeys? | boolean | `false`
`startWithWalking` | Consider walking to nearby stations at the beginning of a journey? | boolean | `true`
`walkingSpeed` | `slow`, `normal` or `fast`. | string | `normal`
`tickets` | Return information about available tickets? | boolean | `false`
`polylines` | Fetch & parse a shape for each journey leg? | boolean | `false`
`remarks` | Parse & return hints & warnings? | boolean | `true`
`scheduledDays` | Parse & return dates each journey is valid on? | boolean | `false`
`language` | Language of the results. | string | `en`
`suburban` | Include S-Bahn (S)? | boolean | `true`
`subway` | Include U-Bahn (U)? | boolean | `true`
`tram` | Include Tram (T)? | boolean | `true`
`bus` | Include Bus (B)? | boolean | `true`
`ferry` | Include Fähre (F)? | boolean | `true`
`express` | Include IC/ICE (E)? | boolean | `true`
`regional` | Include RB/RE (R)? | boolean | `true`

### Examples

```shell
# stop/station to POI
curl 'https://v5.vbb.transport.rest/journeys?from=900000023201&to.id=900980720&to.name=ATZE+Musiktheater&to.latitude=52.54333&to.longitude=13.35167' -s | jq
# without buses, with ticket info
curl 'https://v5.vbb.transport.rest/journeys?from=…&to=…&bus=false&tickets=true' -s | jq
```


## `GET /journeys/:ref`

Uses [`hafasClient.refreshJourney()`](https://github.com/public-transport/hafas-client/blob/5/docs/refresh-journey.md) to **"refresh" a journey, using its `refreshToken`**.

The journey will be the same (equal `from`, `to`, `via`, date/time & vehicles used), but you can get up-to-date realtime data, like delays & cancellations.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`stopovers` | Fetch & parse stopovers on the way? | boolean | `false`
`tickets` | Fetch & parse a shape for each journey leg? | boolean | `false`
`polylines` | Return information about available tickets? | boolean | `false`
`remarks` | Parse & return hints & warnings? | boolean | `true`
`language` | Language of the results. | string | `en`

### Example

```shell
# get the refreshToken of a journey
journey=$(curl 'https://v5.vbb.transport.rest/journeys?from=…&to=…&results=1' -s | jq '.journeys[0]')
refresh_token=$(echo $journey | jq -r '.refreshToken')

# refresh the journey
curl "https://v5.vbb.transport.rest/journeys/$(echo $refresh_token | url-encode)" -s | jq
```


## `GET /trips/:id`

Uses [`hafasClient.trip()`](https://github.com/public-transport/hafas-client/blob/5/docs/trip.md) to **fetch a trip by ID**.

A trip is a specific vehicle, stopping at a series of stops at specific points in time. Departures, arrivals & journey legs reference trips by their ID.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`lineName` | **Required.** Line name of the part's mode of transport, e.g. `RE7`. | string | –
`stopovers` | Fetch & parse stopovers on the way? | boolean | `true`
`remarks` | Parse & return hints & warnings? | boolean | `true`
`polyline` | Fetch & parse the geographic shape of the trip? | boolean | `false`
`language` | Language of the results. | string | `en`

### Example

```shell
# get the trip ID of a journey leg
journey=$(curl 'https://v5.vbb.transport.rest/journeys?from=…&to=…&results=1' -s | jq '.journeys[0]')
journey_leg=$(echo $journey | jq -r '.legs[0]')
trip_id=$(echo $journey_leg | jq -r '.tripId')

# fetch the trip
curl "https://v5.vbb.transport.rest/trips/$(echo $trip_id | url-encode)" -s | jq
```


## `GET /radar`

Uses [`hafasClient.radar()`](https://github.com/public-transport/hafas-client/blob/5/docs/radar.md) to **find all vehicles currently in an area**, as well as their movements.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`north` | **Required.** Northern latitude. | number | –
`west` | **Required.** Western longitude. | number | –
`south` | **Required.** Southern latitude. | number | –
`east` | **Required.** Eastern longitude. | number | –
`results` | Max. number of vehicles. | integer | `256`
`duration` | Compute frames for the next `n` seconds. | integer | `30`
`frames` | Number of frames to compute. | integer | `3`
`polylines` | Fetch & parse a geographic shape for the movement of each vehicle? | boolean | `true`
`language` | Language of the results. | string | `en`

### Example

```shell
bbox='north=52.52411&west=13.41002&south=52.51942&east=13.41709'
curl "https://v5.vbb.transport.rest/radar?$bbox&results=10" -s | jq
```


## `GET /lines`

**Filters the lines in [`vbb-lines`](https://npmjs.com/package/vbb-lines).**

Instead of receiving a JSON response, you can request [newline-delimited JSON](http://ndjson.org) by sending `Accept: application/x-ndjson`.

### Query Parameters

parameter | description | type | default value
----------|-------------|------|--------------
`id` | Filter by ID. | string | –
`name` | Filter by name. | string | –
`operator` | Filter by operator id. See [`agency.txt`](https://vbb-gtfs.jannisr.de/latest/agency.txt). | string | –
`variants` | Return stops/stations along the line? | boolean | `true`
`mode` | Filter by mode of transport as in [*Friendly Public Transport Format* `1.2.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.2.1/spec/readme.md). | string | –
`product` | Filter by [product](https://github.com/public-transport/hafas-client/blob/5/p/vbb/products.js). | string | –

### Example

```shell
curl 'https://v5.vbb.transport.rest/lines?operator=796&variants=false' -s | jq
```


## `GET /lines/:id`

Returns a **line from [`vbb-lines`](https://npmjs.com/package/vbb-lines)**.

### Example

```shell
curl 'https://v5.vbb.transport.rest/lines/17442_900' -s | jq
```


## `GET /shapes/:id`

Output from [`require('vbb-shapes')(id)`](https://github.com/derhuerst/vbb-shapes#usage).


## `GET /maps/:type`

**Redirects to PDF public transport maps.** `type` may be one of these:

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

### Example

```shell
curl -L -o bvg-tram-map.pdf 'https://3.vbb.transport.rest/maps/bvg-tram'
```


## Date/Time Parameters

Possible formats:

- anything that [`parse-human-relative-time`](https://npmjs.com/package/parse-human-relative-time) can parse (e.g. `tomorrow 2pm`)
- [ISO 8601 date/time string](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) (e.g. `2020-04-26T22:43+02:00`)
- [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) (e.g. `1587933780`)
