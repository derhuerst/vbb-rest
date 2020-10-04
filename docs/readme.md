# `v5.vbb.transport.rest` documentation

[`v5.vbb.transport.rest`](https://v5.vbb.transport.rest/) is a [REST API](https://restfulapi.net) for the public transportation system of [Berlin](https://en.wikipedia.org/wiki/Berlin) & [Brandenburg](https://en.wikipedia.org/wiki/Brandenburg), [VBB](https://en.wikipedia.org/wiki/Verkehrsverbund_Berlin-Brandenburg).

[![API status](https://badgen.net/uptime-robot/status/m784879513-ed3cc45a865db0ba57af0001)](https://stats.uptimerobot.com/57wNLs39M/784879513)

Because it wraps [an API](https://github.com/public-transport/hafas-client/blob/master/readme.md#background) of VBB, it **includes all local traffic, as well as some long-distance trains running in the area**. Essentially, it returns whatever data the [VBB app](https://www.vbb.de/fahrplan/vbb-app) shows, **including realtime delays and disruptions**.

You can just use the API without authentication. There's a [rate limit](https://apisyouwonthate.com/blog/what-is-api-rate-limiting-all-about) of 100 requests/minute (burst 200 requests/minute) set up.

- [Getting Started](getting-started.md)
- [API documentation](api.md)

## Why use this API?

### Realtime Data

This API returns realtime data whenever its upstream, the [API for VBB's mobile app](https://github.com/public-transport/hafas-client/blob/33d7d30acf235c54887c6459a15fe581982c6a19/p/vbb/readme.md), provides it.

### No API Key

You can just use the API without authentication. There's a [rate limit](https://apisyouwonthate.com/blog/what-is-api-rate-limiting-all-about) of 100 requests/minute (burst 200 requests/minute) set up.

### CORS

This API has [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) enabled, so you can query it from any webpage.

### Caching-friendly

This API sends [`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) & [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) headers, allowing clients cache responses properly.
