# `GET /autocomplete?query=…`

**Fuzzy-finds stations** matching `query`.



## Example

Request:

```http
GET <server>:<port>/autocomplete?query=alexanderplatz&results=2
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
		"id": 9100005,
		"name": "U Alexanderplatz (Berlin) [Tram]"
	},
	{
		"id": 9100026,
		"name": "S+U Alexanderplatz Bhf/Gontardstr. (Berlin)"
	}
]

```



## Parameters

| parameter | default | type | description |
|:----------|:--------|:-----|:------------|
| `query` | – | `String` | Can be any query. *Required* |
| `results` | `6` | `Integer` | The number of results. |
