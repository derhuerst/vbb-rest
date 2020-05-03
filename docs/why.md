# Why use this API?

The public transport agency *Verkehrsverbund Berlin-Brandenburg* (VBB) itself provides two APIs: [an official one](https://www.vbb.de/unsere-themen/vbbdigital/api-entwicklerinfos/api-fahrplaninfo), and [an unofficial API called *HAFAS*](https://github.com/public-transport/hafas-client/blob/e02a20b1de59bda3cd380445b6105e4c46036636/p/vbb/readme.md) (this API wraps the unofficial one). Why use `v5.vbb.transport.rest`? (And what could VBB do better?)

## No API Key

The underlying HAFAS API has been designed to be *private*: It has only 1 static API key, which is valid for an unlimited time, and which can't easily be revoked/renewed. **This API doesn't require a key.**

## CORS

If you want to use transport information on a web site/app, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) must be enabled. Otherwise, you would have to send all requests through your own proxy server. **This API has CORS enabled**, the underyling HAFAS API does not.

## Readable Markup

Compare their official API:

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

Again, the HAFAS API:

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

## Caching-friendly

This API sends [`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) & [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) headers, allowing clients to refresh their state efficiently.

## HTTP/2

[HTTP/2](https://http2.github.io/) allows multiple requests at a time, efficiently pipelines sequential requests and compresses headers. See [Cloudflare's HTTP/2 page](https://blog.cloudflare.com/http-2-for-web-developers/).

## Proper HTTP, Proper REST

This wrapper API follows [REST-ful design principles](https://restfulapi.net), it uses `GET`, and proper paths & headers.
