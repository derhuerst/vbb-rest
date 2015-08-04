# `GET /locations/{station}`

**Queries the next departures at a station.**



## Example

Request:

```http
GET /departures/9007102?bus=false&results=4
```

`9100003` is the `id` for the [station *Gesundbrunnen*](https://www.google.de/maps/place/Bahnhof+Berlin+Gesundbrunnen/@52.5487914,13.3893007,17z). This value can be found using the [`/locations` endpoint](locations.md).

Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache
Content-Length: 620
Accept-Ranges: bytes
Date: Tue, 04 Aug 2015 02:24:50 GMT
Connection: close
```

```json
[
	{
		"stop": 9007102,
		"line": "S25",
		"type": "suburban",
		"direction": "S+U Potsdamer Platz Bhf (Berlin)",
		"when": 1438655040000,
		"realtime": 1438655040000
	}, {
		"stop": 9007102,
		"line": "S41",
		"type": "suburban",
		"direction": "Ringbahn S 41",
		"when": 1438655100000,
		"realtime": 1438655100000
	}, {
		"stop": 9007102,
		"line": "U8",
		"type": "subway",
		"direction": "S+U Wittenau (Berlin) [U8]",
		"when": 1438655160000,
		"realtime": 1438655280000
	}, {
		"stop": 9007102,
		"line": "S2",
		"type": "suburban",
		"direction": "S Bernau Bhf",
		"when": 1438655160000,
		"realtime": 1438655160000
	}
]
```

`when` and `realtime` are [UNIX timestamps](https://en.wikipedia.org/wiki/Unix_time#Encoding_time_as_a_number).



## `station`

The `id` of the station. It can be found using the [`/locations` endpoint](locations.md).



## Parameters

| parameter | default | type | description |
|:----------|:--------|:-----|:------------|
| `results` | `10` | `Integer` | The number of results. |
| `when` | `new Date()` | `Date` | Self-explanatory. |
| `direction` | – | `Integer` | The `id` of the last station of the line. |
| `suburban` | `true`  | `Integer` | If [S-Bahn trains](https://en.wikipedia.org/wiki/Berlin_S-Bahn) should be included in the search results. |
| `subway` | `true`  | `Integer` | If [U-Bahn trains](https://en.wikipedia.org/wiki/Berlin_U-Bahn) should be included in the search results. |
| `tram` | `true`  | `Integer` | If [tramway vehicles](https://en.wikipedia.org/wiki/Trams_in_Berlin) should be included in the search results. |
| `bus` | `true`  | `Integer` | If [buses](https://en.wikipedia.org/wiki/Bus_transport_in_Berlin) should be included in the search results. |
| `ferry` | `true`  | `Integer` | If [ferries](https://en.wikipedia.org/wiki/Ferry_transport_in_Berlin) should be included in the search results. |
| `express` | `false`  | `Integer` | If [IC](https://en.wikipedia.org/wiki/Intercity_%28Deutsche_Bahn%29)/[EC](https://en.wikipedia.org/wiki/EuroCity)/[ICE](https://en.wikipedia.org/wiki/Intercity-Express) should be included in the search results. |
| `regional` | `true`  | `Integer` | If [RE](https://en.wikipedia.org/wiki/Regional-Express)/[RB](https://en.wikipedia.org/wiki/Regionalbahn)/[IRE](https://en.wikipedia.org/wiki/Interregio-Express) trains should be included in the search results. |
