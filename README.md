# vbb-rest

*vbb-rest* is an HTTP server that proxies all requests to the **Berlin & Brandenburg public transport (VBB) API**. Using the [`vbb` API client library](https://github.com/derhuerst/vbb), it wraps the verbose HAFAS interface in a straightforward REST API.

*vbb-rest* is written in CoffeeScript and embraces [prototypal programming](http://davidwalsh.name/javascript-objects-deconstruction#simpler-object-object), making it easily extendable. It is [MIT-licensed](LICENSE).**



## Installing (globally)

```shell
npm install -g vbb-rest
```

You can now start the *vbb-rest* server wherever you want.



## Usage

Get an [API token](http://www.vbb.de/de/article/webservices/schnittstellen-fuer-webentwickler/5070.html#testserver) first.

```shell
vbb-rest -t <token>   # run the server in "live mode"
```

or

```shell
vbb-restd -t <token>   # start/stop the server in the background
```


### `vbb-rest`

```
Usage:
vbb-rest <token> [-p <port>]

Arguments:
  token       The VBB API server access token.

Options:
  -p, --port  Where the casket server will listen. Default: 8000
```


### `vbb-restd`

```
Usage:
vbb-restd start <token> [-p <port>]
vbb-restd stop <id>

Arguments:
  token       The VBB API server access token.
  id          The server process id.

Options:
  -p, --port  Where the server will listen. Default: 8000
```

When you start a server, it will print its process id.

```shell
$ vbb-restd start <token> -p 8888
info: The server <id> has been started.
```

You can use thie id later use to stop the server.

```shell
$ vbb-restd stop <id>.
info: The server <id> has been stopped.
```



## Documentation

- [*vbb-rest* HTTP documentation](docs/index.md)



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-rest/issues).
