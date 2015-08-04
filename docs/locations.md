# `GET /locations?query=…`

**Finds stations, addresses and [POI](https://en.wikipedia.org/wiki/Point_of_interest)s** matching `query`.



## Example

Request:

```http
GET /locations?query=alexanderplatz&addresses=false&bus=false&results=2
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
        title: 'Alexanderplatz Bhf (Berlin) (S+U)',
        latitude: 52.521508,
        longitude: 13.411267,
        id: 9100003,
        type: 'station',
        products: {
            suburban: true,
            subway: false,
            tram: false,
            bus: true,
            ferry: false,
            express: false,
            regional: true
        }
    },
    {
        title: 'Alexanderplatz (Berlin) [Tram] (U)',
        latitude: 52.522389,
        longitude: 13.414494,
        id: 9100005,
        type: 'station',
        products: {
            suburban: false,
            subway: false,
            tram: true,
            bus: false,
            ferry: false,
            express: false,
            regional: false
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
| `suburban` | `true`  | `Integer` | If [S-Bahn trains](https://en.wikipedia.org/wiki/Berlin_S-Bahn) should be included in the search results. |
| `subway` | `true`  | `Integer` | If [U-Bahn trains](https://en.wikipedia.org/wiki/Berlin_U-Bahn) should be included in the search results. |
| `tram` | `true`  | `Integer` | If [tramway vehicles](https://en.wikipedia.org/wiki/Trams_in_Berlin) should be included in the search results. |
| `bus` | `true`  | `Integer` | If [buses](https://en.wikipedia.org/wiki/Bus_transport_in_Berlin) should be included in the search results. |
| `ferry` | `true`  | `Integer` | If [ferries](https://en.wikipedia.org/wiki/Ferry_transport_in_Berlin) should be included in the search results. |
| `express` | `false`  | `Integer` | If [IC](https://en.wikipedia.org/wiki/Intercity_%28Deutsche_Bahn%29)/[EC](https://en.wikipedia.org/wiki/EuroCity)/[ICE](https://en.wikipedia.org/wiki/Intercity-Express) should be included in the search results. |
| `regional` | `true`  | `Integer` | If [RE](https://en.wikipedia.org/wiki/Regional-Express)/[RB](https://en.wikipedia.org/wiki/Regionalbahn)/[IRE](https://en.wikipedia.org/wiki/Interregio-Express) trains should be included in the search results. |
