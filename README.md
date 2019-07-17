# HTTP/REST API recorder and replayer

You can use it to mock API servers that are unstable/changing from time to time instead of creating mock response manually each time.

(Proxy support is through the npm package global-agent, read its npm page for more infomation)

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

rest-replayer <cmd> [args]

Commands:
  rest-replayer record [args]  Record http/rest traffics
  rest-replayer replay [args]  Replay http/rest traffics

Options:
  --version      Show version number                                   [boolean]
  --name, -n     Name of the record               [string] [default: "_default"]
  --port, -p     The port for rest-replayer to listen on        [default: 43210]
  --format, -f   Storage format                       [string] [default: "json"]
  --storage-dir  Storage directory               [string] [default: "./storage"]
  --help         Show help                                             [boolean]
```
