# Why use this API?

The public transport agency of Berlin and Brandenburg (VBB) itself provides an API. Why use this one? (And what could VBB do better?)

## No API Key

Especially on web sites/apps, it isn't feasable to the send API keys to the client. Also, you have to obtain these keys manually and cannot automatically revoke them. **This API doesn't require a key.**

## CORS

If you want to use transport information on a web site/app, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) must be enabled. Otherwise, you would have to send all requests through your own proxy server. **This API has CORS enabled.**

## No Rate Limits

The official API has hourly request limits and doesn't [properly tell](http://stackoverflow.com/questions/16022624/examples-of-http-api-rate-limiting-http-response-headers) that. **This API doesn't have any limits.**

## Sane Markup

Compare the official API:

```js
Origin: {
	Notes: {
		Note: [{
			value: 'Fahrt für Touch&Travel zugelassen',
			key: 'TT',
			type: 'A',
			priority: 999
		}]
	},
	name: 'Kirschenallee (Berlin)',
	type: 'ST',
	id: 'A=1@O=Kirschenallee (Berlin)@X=13267233@Y=52520384@U=86@L=9020103@', // wat
	extId: '9020103',
	lon: 13.267233,
	lat: 52.520384,
	prognosisType: 'CALCULATED',
	time: '11:40:00',
	date: '2016-05-26',
	rtTime: '11:42:00',
	rtDate: '2016-05-26'
}
```

to this one:

```js
{
    from: {
        name: 'Kirschenallee',
        latitude: 52.520384,
        longitude: 13.267233,
        type: 'station',
        id: 9020103
    },
    start: 1465300183, // UNIX timestamp
    transport: 'public',
    notes: {touchAndTravel: true}
}
```

Again, the official API:

```js
{
	name: 'Ermäßigungstarif',
	price: 470,
	cur: 'EUR',
	shpCtx: '{"FV":"VBB-1","TC":"Bartarif","SW":"5656","ZW":"5656","TLS":"B1TE","VT":"Berlin AB"}'
}
```

and this one:

```js
{
	name: 'Ermäßigungstarif',
	price: 4.7,
	tariff: 'Berlin',
	coverage: 'AB',
	variant: '1 day, reduced',
	amount: 1,
	reduced: true,
	fullDay: true
}
```

VBB also has a mobile API (which this API uses under the hood) with an even more verbose output.

## GZIP support

Especially on cellular connections, gzipped responses improve the performance a lot.

## HTTP/2

[HTTP/2](https://http2.github.io/) allows multiple requests at a time, efficiently pipelines sequential requests and compresses headers. See [Cloudflare's HTTP/2 page](https://blog.cloudflare.com/http-2-for-web-developers/).

## More Features

This API enhances the functionality of their API with static data, which is used in e.g. `GET /stations` and `GET /lines`.

## Proper HTTP, Proper REST

All methods in this API strongly comply with the [REST principles](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) and use proper [HTTP methods](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html).
