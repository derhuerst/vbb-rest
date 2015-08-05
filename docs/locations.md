# `GET /locations?query=…`

**Finds stations, addresses and [POI](https://en.wikipedia.org/wiki/Point_of_interest)s** matching `query`.



## Example

Request:

```http
GET /locations?query=alexanderplatz&addresses=false&results=2
```

Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache
Content-Length: 470
Accept-Ranges: bytes
Date: Tue, 04 Aug 2015 01:59:03 GMT
Connection: close
```

```json
[
	{
		"title": "Alexanderplatz Bhf (Berlin) (S+U)",
		"latitude": 52.521507999999997,
		"longitude": 13.411267,
		"id": 9100003,
		"type": "station",
		"products": {
			"bus": true,
			"express": false,
			"ferry": false,
			"regional": true,
			"suburban": true,
			"subway": false,
			"tram": false
		}
	}, {
		"title": "Alexanderplatz (Berlin) [Tram] (U)",
		"latitude": 52.522388999999997,
		"longitude": 13.414493999999999,
		"id": 9100005,
		"type": "station",
		"products": {
			"bus": false,
			"express": false,
			"ferry": false,
			"regional": false,
			"suburban": false,
			"subway": false,
			"tram": true
		}
	}
]
```



## Parameters

| parameter | default | type | description |
|:----------|:--------|:-----|:------------|
| `query` | – | `String` | Can be any query. *Required* |
| `results` | `5` | `Integer` | The number of results, limited to `1000` by HAFAS. |
| `stations` | `true` | `Boolean` | If stations should be included in the search results. |
| `addresses` | `true` | `Boolean` | If addresses should be included in the search results. |
| `pois` | `true` | `Boolean` | If [POI](https://en.wikipedia.org/wiki/Point_of_interest)s should be included in the search results. |
