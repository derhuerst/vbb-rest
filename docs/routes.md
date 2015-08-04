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
        duration: 1140000,
        parts: [
            {
                from: {
                    title: 'S+U Alexanderplatz Bhf (Berlin)',
                    latitude: 52.521508,
                    longitude: 13.411267,
                    id: 9100003,
                    type: 'station',
                    notes: { lift: true, escalator: true },
                    when: '2015-08-04T02:19:00.000Z'
                },
                to: {
                    title: 'S+U Zoologischer Garten Bhf (Berlin)',
                    latitude: 52.506882,
                    longitude: 13.332926,
                    id: 9023201,
                    type: 'station',
                    notes: { lift: true, escalator: true },
                    when: '2015-08-04T02:30:00.000Z'
                },
                transport: 'public',
                type: 'regional',
                line: 'RE2',
                direction: 'Wismar, Bahnhof',
                notes: {}
            },
            {
                from: {
                    title: 'S+U Zoologischer Garten Bhf (Berlin)',
                    latitude: 52.506882,
                    longitude: 13.332926,
                    id: 9023201,
                    type: 'station',
                    notes: { lift: true, escalator: true },
                    when: '2015-08-04T02:30:00.000Z'
                },
                to: {
                    title: '10623 Berlin-Tiergarten, Müller-Breslau-Str.',
                    latitude: 52.511143,
                    longitude: 13.336108,
                    type: 'address',
                    when: '2015-08-04T02:38:00.000Z'
                },
                transport: 'walk'
            }
        ]
    }
]
```



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
