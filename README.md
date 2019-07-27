# HTTP/REST API recorder and replayer

You can use it to mock API servers that are unstable/changing from time to time instead of creating mock response manually each time.

(Proxy support is through the npm package global-agent, read its [github page](https://github.com/gajus/global-agent) for more infomation)

## Basic usage

Record:

```bash
rest-replayer record -t http://localhost:9004
```

Replay:

```bash
rest-replayer replay
```

(Default port is 43210)

Command line help:

```bash
rest-replayer --help
```

## Storage format

### Currently implemented

#### JSON : [Schema here](storer/json_storer.schema.json)

### Planned (unimplemented)

### SQLite
