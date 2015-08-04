# `GET /routes/{from}/{to}`

**Finds routes between `from` and `to`.**



## Example

Request:

```http
GET /routes/9100003/@52.5112362|13.3358289?results=1&suburban=false
```

`9100003` is the `id` for the [station *Alexanderplatz*](https://www.google.de/maps/place/Alexanderplatz/@52.5219184,13.4132147,17z). `@52.5112362|13.3358289` are GPS coordinates for the [restaurant *Schleusenkrug*](https://www.google.de/maps/place/Schleusenkrug/@52.5112362,13.3358289,17z). Both values can be found using the [`/locations` endpoint](locations.md).

Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache
Content-Length: 904
Accept-Ranges: bytes
Date: Tue, 04 Aug 2015 02:12:39 GMT
Connection: close
```

```json
[
	{
		"duration": 1140,
		"parts": [
			{
				"from": {
					"id": 9100003,
					"latitude": 52.521507999999997,
					"longitude": 13.411267,
					"notes": {
						"escalator": true,
						"lift": true
					},
					"title": "S+U Alexanderplatz Bhf (Berlin)",
					"type": "station",
					"when": 1438654740000
				},
				"to": {
					"id": 9023201,
					"latitude": 52.506881999999997,
					"longitude": 13.332926,
					"notes": {
						"escalator": true,
						"lift": true
					},
					"title": "S+U Zoologischer Garten Bhf (Berlin)",
					"type": "station",
					"when": 1438655400000
				},
				"transport": "public",
				"type": "regional",
				"line": "RE2",
				"direction": "Wismar, Bahnhof",
				"notes": {}
			}, {
				"from": {
					"id": 9023201,
					"latitude": 52.506881999999997,
					"longitude": 13.332926,
					"notes": {
						"escalator": true,
						"lift": true
					},
					"title": "S+U Zoologischer Garten Bhf (Berlin)",
					"type": "station",
					"when": 1438655400000
				},
				"to": {
					"latitude": 52.511142999999997,
					"longitude": 13.336107999999999,
					"title": "10623 Berlin-Tiergarten, Müller-Breslau-Str.",
					"type": "address",
					"when": 1438655880000
				},
				"transport": "walk"
			}
		]
	}
]
```

`duration` is the trips overall duration in seconds.

`when` is an [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time#Encoding_time_as_a_number).



## `from`

**Must either be the `id` or GPS coordinates of the start location.** The GPS coordinates must begin with `@` and must be separated by `|`.



## `to`

**Must either be the `id` or GPS coordinates of the destination.** The GPS coordinates must begin with `@` and must be separated by `|`.



## Parameters

| parameter | default | type | description |
|:----------|:--------|:-----|:------------|
| `via` | – | `Integer` | The `id` of an optional waypoint location. |
| `results` | `4` | `Integer` | The number of results, limited to `6` by HAFAS. |
| `when` | `new Date()` | `Date` | Self-explanatory. |
| `changes` | – | `Integer` | The maximum number of changes, limited to `3` by HAFAS. |
| `changeTimeFactor` | `1` | `Float` | The walking speed, between `1` and `5`. `5` represents 5 times more time to change. |
| `suburban` | `true`  | `Integer` | If [S-Bahn trains](https://en.wikipedia.org/wiki/Berlin_S-Bahn) should be included in the search results. |
| `subway` | `true`  | `Integer` | If [U-Bahn trains](https://en.wikipedia.org/wiki/Berlin_U-Bahn) should be included in the search results. |
| `tram` | `true`  | `Integer` | If [tramway vehicles](https://en.wikipedia.org/wiki/Trams_in_Berlin) should be included in the search results. |
| `bus` | `true`  | `Integer` | If [buses](https://en.wikipedia.org/wiki/Bus_transport_in_Berlin) should be included in the search results. |
| `ferry` | `true`  | `Integer` | If [ferries](https://en.wikipedia.org/wiki/Ferry_transport_in_Berlin) should be included in the search results. |
| `express` | `false`  | `Integer` | If [IC](https://en.wikipedia.org/wiki/Intercity_%28Deutsche_Bahn%29)/[EC](https://en.wikipedia.org/wiki/EuroCity)/[ICE](https://en.wikipedia.org/wiki/Intercity-Express) should be included in the search results. |
| `regional` | `true`  | `Integer` | If [RE](https://en.wikipedia.org/wiki/Regional-Express)/[RB](https://en.wikipedia.org/wiki/Regionalbahn)/[IRE](https://en.wikipedia.org/wiki/Interregio-Express) trains should be included in the search results. |
