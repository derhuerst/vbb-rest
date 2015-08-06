# vbb-rest

*vbb-rest* is an HTTP server that proxies all requests to the **Berlin & Brandenburg public transport (VBB) API**. Using the [`vbb` API client library](https://github.com/derhuerst/vbb), it wraps the verbose HAFAS interface in a straightforward REST API.

*vbb-rest* is written in CoffeeScript and embraces [prototypal programming](http://davidwalsh.name/javascript-objects-deconstruction#simpler-object-object), making it easily extendable. It is [MIT-licensed](LICENSE).

[![npm version](https://img.shields.io/npm/v/vbb-rest.svg)](https://www.npmjs.com/package/vbb-rest)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-rest.svg)](https://david-dm.org/derhuerst/vbb-rest)



## Installing (globally)

```shell
npm install -g vbb-rest
```

You can now start the *vbb-rest* server wherever you want.



## Usage

The server will forward the [VBB API token](http://www.vbb.de/de/article/webservices/schnittstellen-fuer-webentwickler/5070.html#testserver) from the HTTP `X-API-Key` field, so get one for testing.

```shell
vbb-rest -c <cert> -k <key>   # run the server in "live mode"
```

or

```shell
vbb-restd start -c <cert> -k <key>   # start/stop the server in the background
```


### `vbb-rest`

```
Usage:
vbb-rest -c <cert> -k <key> [-p <port>]

Arguments:
  -c, --cert    The SSL certificate.
  -k, --key     The SSL key.

Options:
  -p, --port    Where the server will listen. Default: 8000
```


### `vbb-restd`

```
Usage:
vbb-restd start -c <cert> -k <key> [-p <port>]
vbb-restd stop <id>

Arguments:
  -c, --cert    The SSL certificate.
  -k, --key     The SSL key.
  id            The server process id.

Options:
  -p, --port    Where the server will listen. Default: 8000
```

When you `start` a server, it will print its process id.

```shell
vbb-restd start -c <cert> -k <key>
info: The server <id> has been started.
```

You can use the `id` later to `stop` the server.

```shell
$ vbb-restd stop <id>.
info: The server <id> has been stopped.
```



## Documentation

- [*vbb-rest* HTTP documentation](docs/index.md)



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-rest/issues).
