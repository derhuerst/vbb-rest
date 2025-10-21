import {generateApiDocs} from 'hafas-rest-api/tools/generate-docs.js'
import {api} from '../api.js'

const HEAD = `\
# \`v7.vbb.transport.rest\` API documentation

[\`v7.vbb.transport.rest\`](https://v7.vbb.transport.rest/) is a [REST API](https://restfulapi.net). Data is being returned as [JSON](https://www.json.org/).

You can just use the API without authentication. There's a [rate limit](https://apisyouwonthate.com/blog/what-is-api-rate-limiting-all-about) of 100 request/minute (burst 200 requests/minute) set up.

[OpenAPI playground](https://petstore.swagger.io/?url=https%3A%2F%2Fv7.vbb.transport.rest%2F.well-known%2Fservice-desc%0A)

*Note:* The examples snippets in this documentation uses the \`url-encode\` CLI tool of the [\`url-decode-encode-cli\` package](https://www.npmjs.com/package/url-decode-encode-cli) for [URL-encoding](https://de.wikipedia.org/wiki/URL-Encoding).
`

const order = [
	'/locations',
	'/locations/nearby',
	'/stops',
	'/stops/reachable-from',
	'/stops/:id',
	'/stops/:id/departures',
	'/stops/:id/arrivals',
	'/stations', '/stations/:id',
	'/journeys',
	'/journeys/:ref',
	'/trips/:id',
	'/radar',
	'/lines', '/lines/:id',
	'/shapes/:id',
	'/maps/:type',
]

const descriptions = {
	'/locations': `\
Uses [\`hafasClient.locations()\`](https://github.com/public-transport/hafas-client/blob/6/docs/locations.md) to **find stops/stations, POIs and addresses matching \`query\`**.
`,
	'/locations/nearby': `\
Uses [\`hafasClient.nearby()\`](https://github.com/public-transport/hafas-client/blob/6/docs/nearby.md) to **find stops/stations close to the given geolocation**.
`,
	'/stops/reachable-from': `\
Uses [\`hafasClient.reachableFrom()\`](https://github.com/public-transport/hafas-client/blob/6/docs/reachable-from.md) to **find stops/stations reachable within a certain time from an address**.
`,
	'/stops/:id': `\
Uses [\`hafasClient.stop()\`](https://github.com/public-transport/hafas-client/blob/6/docs/stop.md) to **find a stop/station by ID**.
`,
	'/stops/:id/departures': `\
Uses [\`hafasClient.departures()\`](https://github.com/public-transport/hafas-client/blob/6/docs/departures.md) to **get departures at a stop/station**.
`,
	'/stops/:id/arrivals': `\
Works like [\`/stops/:id/departures\`](#get-stopsiddepartures), except that it uses [\`hafasClient.arrivals()\`](https://github.com/public-transport/hafas-client/blob/6/docs/arrivals.md) to **arrivals at a stop/station**.
`,
	'/stations': `\
If the \`query\` parameter is used, it will use [\`vbb-stations-autocomplete@4\`](https://github.com/derhuerst/vbb-stations-autocomplete/tree/4.3.0) to autocomplete stops/stations by name. Otherwise, it will filter the stops/stations in [\`vbb-stations@7\`](https://github.com/derhuerst/vbb-stations/tree/7.3.2).

Instead of receiving a JSON response, you can request [newline-delimited JSON](http://ndjson.org) by sending \`Accept: application/x-ndjson\`.
`,
	'/stations/:id': `\
Returns a stop/station from [\`vbb-stations@7\`](https://github.com/derhuerst/vbb-stations/tree/7.3.2).
`,
	'/journeys': `\
Uses [\`hafasClient.journeys()\`](https://github.com/public-transport/hafas-client/blob/6/docs/journeys.md) to **find journeys from A (\`from\`) to B (\`to\`)**.

\`from\` (A), \`to\` (B), and the optional \`via\` must each have one of these formats:

- as stop/station ID (e.g. \`from=900017101\` for *U Mehringdamm*)
- as a POI (e.g. \`from.id=900980720&from.latitude=52.54333&from.longitude=13.35167&from.name=ATZE+Musiktheater\` for *ATZE Musiktheater*)
- as an address (e.g. \`from.latitude=52.543333&from.longitude=13.351686&from.address=Voltastr.+17\` for *Voltastr. 17*)

### Pagination

Given a response, you can also fetch more journeys matching the same criteria. Instead of \`from*\`, \`to*\` & \`departure\`/\`arrival\`, pass \`earlierRef\` from the first response as \`earlierThan\` to get journeys "before", or \`laterRef\` as \`laterThan\` to get journeys "after".

Check the [\`hafasClient.journeys()\` docs](https://github.com/public-transport/hafas-client/blob/6/docs/journeys.md) for more details.
`,
	'/journeys/:ref': `\
Uses [\`hafasClient.refreshJourney()\`](https://github.com/public-transport/hafas-client/blob/6/docs/refresh-journey.md) to **"refresh" a journey, using its \`refreshToken\`**.

The journey will be the same (equal \`from\`, \`to\`, \`via\`, date/time & vehicles used), but you can get up-to-date realtime data, like delays & cancellations.
`,
	'/trips/:id': `\
Uses [\`hafasClient.trip()\`](https://github.com/public-transport/hafas-client/blob/6/docs/trip.md) to **fetch a trip by ID**.

A trip is a specific vehicle, stopping at a series of stops at specific points in time. Departures, arrivals & journey legs reference trips by their ID.
`,
	'/radar': `\
Uses [\`hafasClient.radar()\`](https://github.com/public-transport/hafas-client/blob/6/docs/radar.md) to **find all vehicles currently in an area**, as well as their movements.
`,
	'/lines': `\
**Filters the lines in [\`vbb-lines\`](https://npmjs.com/package/vbb-lines).**

Instead of receiving a JSON response, you can request [newline-delimited JSON](http://ndjson.org) by sending \`Accept: application/x-ndjson\`.
`,
	'/lines/:id': `\
Returns a **line from [\`vbb-lines\`](https://npmjs.com/package/vbb-lines)**.
`,
	'/shapes/:id': `\
Output from [\`require('vbb-shapes')(id)\`](https://github.com/derhuerst/vbb-shapes#usage).
`,
	'/maps/:type': `\
**Redirects to PDF public transport maps.** \`type\` may be one of these:

\`type\` | Description
-------|------------
\`bvg\` | Day, **Berlin ABC**, S-Bahn & U-Bahn
\`bvg-tram\` | Day & Night, **Berlin ABC**, Trams
\`bvg-night\` | Night, **Berlin ABC**, S-Bahn & U-Bahn
\`bvg-refugees\` | Day, **Berlin-ABC**, S-Bahn & U-Bahn, Translations
\`vbb\` | Day, **Berlin & Brandenburg**, RE & RB trains
\`brb\` | Day, **Brandenburg an der Havel**
\`cb\` | Day & Night, **Cottbus**
\`cb-night\` | Night, **Cottbus**
\`ff\` | Day, **Frankfurt Oder**
\`p\` | Day, **Potsdam**
\`p-night\` | Night, **Potsdam**
`,
}

const examples = {
	'/locations': `\
### Example

\`\`\`shell
curl 'https://v7.vbb.transport.rest/locations?query=alexanderplatz&results=1' -s | jq
\`\`\`

\`\`\`js
[
	{
		"type": "stop",
		"id": "900100003",
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
\`\`\`
`,
	'/locations/nearby': `\
### Example

\`\`\`shell
curl 'https://v7.vbb.transport.rest/locations/nearby?latitude=52.52725&longitude=13.4123' -s | jq
\`\`\`

\`\`\`js
[
	{
		"type": "stop",
		"id": "900100016",
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
		"id": "900110005",
		"name": "U Senefelderplatz",
		"location": { /* … */ },
		"products": { /* … */ },
		"distance": 597
	},
	// …
]
\`\`\`
`,
	'/stops/reachable-from': `\
### Example

\`\`\`shell
curl 'https://v7.vbb.transport.rest/stops/reachable-from?latitude=52.52446&longitude=13.40812&address=10178+Berlin-Mitte,+Münzstr.+12' -s | jq
\`\`\`

\`\`\`js
{
	"reachable": [
		{
			"duration": 4,
			"stations": [
				{
					"type": "stop",
					"id": "900100051",
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
					"id": "900007110",
					"name": "U Bernauer Str.",
					"location": { /* … */ },
					"products": { /* … */ }
				},
				{
					"type": "stop",
					"id": "900100004",
					"name": "S+U Jannowitzbrücke",
					"location": { /* … */ },
					"products": { /* … */ }
				},
				// …
			]
		},
		// …
	],
	"realtimeDataUpdatedAt": 123456789, // UNIX timestamp
}
\`\`\`
`,
	'/stops/:id': `\
### Example

\`\`\`shell
curl 'https://v7.vbb.transport.rest/stops/900017101' -s | jq
\`\`\`

\`\`\`js
{
	"type": "stop",
	"id": "900017101",
	"name": "U Mehringdamm",
	"location": {
		"type": "location",
		"id": "900017101",
		"latitude": 52.49357,
		"longitude": 13.388138
	},
	"products": { /* … */ },
}
\`\`\`
`,
	'/stops/:id/departures': `\
### Example

\`\`\`shell
# at U Kottbusser Tor, in direction U Görlitzer Bahnhof
curl 'https://v7.vbb.transport.rest/stops/900013102/departures?direction=900014101&duration=10' -s | jq
\`\`\`

\`\`\`js
{
	"departures": [
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
				"id": "900013102",
				"name": "U Kottbusser Tor",
				"location": { /* … */ },
				"products": { /* … */ },
				// …
			},

			"remarks": [ /* … */ ],
		},
		// …
	],
	"realtimeDataUpdatedAt": 123456789, // UNIX timestamp
}
\`\`\`
`,
	'/stops/:id/arrivals': `\
### Example

\`\`\`shell
# at U Kottbusser Tor, 10 minutes
curl 'https://v7.vbb.transport.rest/stops/900013102/arrivals?duration=10' -s | jq
\`\`\`
`,
	'/stations': `\
### Examples

\`\`\`shell
# autocomplete using vbb-stations-autocomplete
curl 'https://v7.vbb.transport.rest/stations?query=mehringd' -s | jq
\`\`\`

\`\`\`js
{
	"type": "station",
	"id": "de:11000:900017101",
	"name": "U Mehringdamm (Berlin)",
	"weight": 12994,
	"location": { /* … */ },
	"stops": [
		{
			"type": "stop",
			"id": "de:11000:900017101::1",
			"name": "U Mehringdamm (Berlin)",
			"station": "de:11000:900017101",
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
\`\`\`

\`\`\`shell
# filter vbb-stations
curl 'https://v7.vbb.transport.rest/stations?location.latitude=52.493567' -s | jq
\`\`\`

\`\`\`js
{
	"de:11000:900017101": {
		"type": "station",
		"id": "de:11000:900017101",
		"name": "U Mehringdamm (Berlin)",
		"weight": 12994,
		"location": { /* … */ },
		"stops": [ /* … */ ],
	},
	// …
}
\`\`\`

\`\`\`shell
# filter vbb-stations, get newline-delimited JSON
curl 'https://v7.vbb.transport.rest/stations?location.latitude=52.493567' -H 'accept: application/x-ndjson' -s | jq
\`\`\`
`,
	'/stations/:id': `\
### Example

\`\`\`shell
# lookup U Mehringdamm
curl 'https://v7.vbb.transport.rest/stations/de:11000:900017101' -s | jq
\`\`\`

\`\`\`js
{
	"type": "station",
	"id": "de:11000:900017101",
	"name": "U Mehringdamm (Berlin)",
	"weight": 6068.5,
	"location": { /* … */ },
	"stops": [ /* … */ ],
	"lines": [ /* … */ ],
	// …
}
\`\`\`
`,
	'/journeys': `\
### Examples

\`\`\`shell
# stop/station to POI
curl 'https://v7.vbb.transport.rest/journeys?from=900023201&to.id=900980720&to.name=ATZE+Musiktheater&to.latitude=52.54333&to.longitude=13.35167' -s | jq
# without buses, with ticket info
curl 'https://v7.vbb.transport.rest/journeys?from=…&to=…&bus=false&tickets=true' -s | jq
\`\`\`
`,
	'/journeys/:ref': `\
### Example

\`\`\`shell
# get the refreshToken of a journey
journey=$(curl 'https://v7.vbb.transport.rest/journeys?from=…&to=…&results=1' -s | jq '.journeys[0]')
refresh_token=$(echo $journey | jq -r '.refreshToken')

# refresh the journey
curl "https://v7.vbb.transport.rest/journeys/$(echo $refresh_token | url-encode)" -s | jq
\`\`\`
`,
	'/trips/:id': `\
### Example

\`\`\`shell
# get the trip ID of a journey leg
journey=$(curl 'https://v7.vbb.transport.rest/journeys?from=…&to=…&results=1' -s | jq '.journeys[0]')
journey_leg=$(echo $journey | jq -r '.legs[0]')
trip_id=$(echo $journey_leg | jq -r '.tripId')

# fetch the trip
curl "https://v7.vbb.transport.rest/trips/$(echo $trip_id | url-encode)" -s | jq
\`\`\`
`,
	'/radar': `\
### Example

\`\`\`shell
bbox='north=52.52411&west=13.41002&south=52.51942&east=13.41709'
curl "https://v7.vbb.transport.rest/radar?$bbox&results=10" -s | jq
\`\`\`
`,
	'/lines': `\
### Example

\`\`\`shell
curl 'https://v7.vbb.transport.rest/lines?operator=796&variants=false' -s | jq
\`\`\`
`,
	'/lines/:id': `\
### Example

\`\`\`shell
curl 'https://v7.vbb.transport.rest/lines/17442_900' -s | jq
\`\`\`
`,
	'/maps/:type': `\
### Example

\`\`\`shell
curl -L -o bvg-tram-map.pdf 'https://3.vbb.transport.rest/maps/bvg-tram'
\`\`\`
`,
}

const generateMarkdownApiDocs = async function* (dest) {
	const {
		listOfRoutes,
		routes,
		tail,
	} = generateApiDocs(api.routes)

	const sortedRoutes = Object.entries(routes)
	.sort(([routeA], [routeB]) => {
		const iA = order.indexOf(routeA)
		const iB = order.indexOf(routeB)
		if (iA >= 0 && iB >= 0) return iA - iB
		if (iA < 0 && iB >= 0) return 1
		if (iB < 0 && iA >= 0) return -1
		return 0
	})

	yield HEAD
	yield `\n\n`

	yield listOfRoutes
	yield `\n\n`

	for (const [route, params] of sortedRoutes) {
		yield `## \`GET ${route}\`\n\n`
		yield descriptions[route] || ''
		if (params) {
			yield `\n### Query Parameters\n`
			yield params
		}
		if (examples[route]) {
			yield '\n' + examples[route]
		}
		yield `\n\n`
	}
	yield tail
}

export {
	generateMarkdownApiDocs,
}
