# Getting Started with `v7.vbb.transport.rest`

Let's walk through the **requests that are necessary to implement a typical basic transit app**.

*Note:* To properly & securely handle user input containing URL-unsafe characters, always [URL-encode](https://en.wikipedia.org/wiki/Percent-encoding) your query parameters!

The following code snippets use [`curl`](https://curl.haxx.se) (a versatile command line HTTP tool) and [`jq`](https://stedolan.github.io/jq/) (the command line swiss army knife for processing JSON).

> [!NOTE]
> The following `curl` commands use the `-L` flag to follow redirects, because some URLs redirect to similar ones. In your HTTP client, make sure to follow redirects, too.

### 1. search for stops

The `/locations?query=…` route allows you to query stops, points of interest (POIs) & addresses. We're only interested in stops though, so we filter using `poi=false&addresses=false`:

```shell
curl 'https://v7.vbb.transport.rest/locations?poi=false&addresses=false&query=südkreuz' -fsSL | jq
```

```js
[
	{
		"type": "stop",
		"id": "900058101",
		"name": "S Südkreuz",
		"location": {
			"type": "location",
			"id": "900058101",
			"latitude": 52.475465,
			"longitude": 13.365575
		},
		"products": {
			"suburban": true,
			"subway": false,
			// …
		},
	},
	{
		"type": "stop",
		"id": "900340912",
		"name": "Hohenselchow, Kreuzung Süd",
		"location": { /* … */ },
		"products": { /* … */ },
	},
	// …
]
```

### 2. fetch departures at a stop

Let's fetch 5 of the next departures at *Berlin Südkreuz* (which has the ID `900058101`):

```shell
curl 'https://v7.vbb.transport.rest/stops/900058101/departures?results=5' -fsSL | jq
```

```js
[
	{ // 1st departure
		"tripId": "1|11200|26|86|4102020",
		"direction": "S+U Alexanderplatz",
		"line": {
			"type": "line",
			"id": "248",
			"name": "248",
			"mode": "bus",
			"product": "bus",
			// …
		},

		"when": "2020-10-04T18:51:00+02:00",
		"plannedWhen": "2020-10-04T18:51:00+02:00",
		"delay": 0,
		"platform": null,
		"plannedPlatform": null,

		"stop": {
			"type": "stop",
			"id": "900058100",
			"name": "S Südkreuz/Ostseite",
			"location": { /* … */ },
			"products": { /* … */ },
		},

		"remarks": [
			{
				"id": "96404",
				"type": "warning",
				"summary": "Together against corona: Keep distance, cover mouth and nose!",
				// …
			},
			// …
		]
	},
	{ // 2nd departure
		"tripId": "1|24332|22|86|4102020",
		"direction": "S+U Potsdamer Platz",
		"line": {
			"type": "line",
			"id": "s26",
			"name": "S26",
			"mode": "train",
			"product": "suburban",
			// …
		},

		"when": "2020-10-04T18:51:00+02:00",
		"plannedWhen": "2020-10-04T18:51:00+02:00",
		"delay": 0,
		"platform": "2",
		"plannedPlatform": "2",

		"stop": { /* … */ },

		"remarks": [ /* … */ ],
	},
	// …
]
```

Note that `when` includes the `delay`, and `plannedWhen` does not.

### 3. fetch journeys from A to B

We call a connection from A to B – at a specific date & time, made up of sections on specific *trips* – `journey`.

Let's fetch 2 journeys from `900058101` (*Südkreuz*) to `900110005` (*Senefelderplatz*), departing tomorrow at 2pm (at the time of writing this).

```shell
curl 'https://v7.vbb.transport.rest/journeys?from=900058101&to=900110005&departure=tomorrow+2pm&results=2' -fsSL | jq
```

```js
{
	"journeys": [{
		// 1st journey
		"type": "journey",
		"legs": [{
			// 1st leg
			"tripId": "1|23897|21|86|5102020",
			"direction": "S Bernau",
			"line": {
				"type": "line",
				"id": "s2",
				"name": "S2",
				"mode": "train",
				"product": "suburban",
				// …
			},

			"origin": {
				"type": "stop",
				"id": "900058101",
				"name": "S Südkreuz",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"departure": "2020-10-05T14:06:00+02:00",
			"plannedDeparture": "2020-10-05T14:06:00+02:00",
			"departureDelay": null,
			"departurePlatform": "2",
			"plannedDeparturePlatform": "2",

			"destination": {
				"type": "stop",
				"id": "900100020",
				"name": "S+U Potsdamer Platz",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"arrival": "2020-10-05T14:13:00+02:00",
			"plannedArrival": "2020-10-05T14:13:00+02:00",
			"arrivalDelay": null,
			"arrivalPlatform": "14",
			"plannedArrivalPlatform": "14",
			// …
		}, {
			// 2nd leg
			"walking": true,
			"distance": null,

			"origin": {
				"type": "stop",
				"id": "900100020",
				"name": "S+U Potsdamer Platz",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"departure": "2020-10-05T14:13:00+02:00",
			"plannedDeparture": "2020-10-05T14:13:00+02:00",
			"departureDelay": null,

			"destination": {
				"type": "stop",
				"id": "900100720",
				"name": "S+U Potsdamer Platz [U2]",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"arrival": "2020-10-05T14:18:00+02:00",
			"plannedArrival": "2020-10-05T14:18:00+02:00",
			"arrivalDelay": null,
			// …
		}, {
			// 3rd leg
			"tripId": "1|21862|2|86|5102020",
			"direction": "S+U Pankow",
			"line": {
				"type": "line",
				"id": "u2",
				"name": "U2",
				"mode": "train",
				"product": "subway",
				// …
			},

			"origin": {
				"type": "stop",
				"id": "900100720",
				"name": "S+U Potsdamer Platz [U2]",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"departure": "2020-10-05T14:18:00+02:00",
			"plannedDeparture": "2020-10-05T14:18:00+02:00",
			"departureDelay": null,
			"departurePlatform": null,
			"plannedDeparturePlatform": null,

			"destination": {
				"type": "stop",
				"id": "900110005",
				"name": "U Senefelderplatz",
				"location": { /* … */ },
				"products": { /* … */ },
			},
			"arrival": "2020-10-05T14:32:00+02:00",
			"plannedArrival": "2020-10-05T14:32:00+02:00",
			"arrivalDelay": null,
			"arrivalPlatform": null,
			"plannedArrivalPlatform": null,

			"cycle": {"min": 240, "max": 300, "nr": 30},
			// …
		}],
		// …
	}, {
		// 2nd journey
		"type": "journey",
		"legs": [ /* … */ ],
		// …
	}, {
		// 3rd journey
		"type": "journey",
		"legs": [ /* … */ ],
		// …
	}],
	"realtimeDataUpdatedAt": 1601830200,
}
```

Note that `departure` includes the `departureDelay`, and `arrival` includes the `arrivalDelay`. `plannedDeparture` and `plannedArrival` do not.

### 4. more features

These are the basics. Check the full [API docs](api.md) for all features or use the [OpenAPI playground](https://petstore.swagger.io/?url=https%3A%2F%2Fv7.vbb.transport.rest%2F.well-known%2Fservice-desc%0A) to explore the API!
