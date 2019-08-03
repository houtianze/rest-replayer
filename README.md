# HTTP/REST API recorder and replayer

You can use it to mock API servers that are unstable/changing from time to time instead of creating mock response manually each time.

(Proxy support is through the npm package global-agent, read its [github page](https://github.com/gajus/global-agent) for more infomation)

## Usage scenario

- Record, finish tests and stop recording (responses will be saved)

```text
+-------------+    +--------------------+    +--------------------------+
| HTTP Client | => | Run it as Recorder | => | Target (e.g. API server) |
+-------------+    +--------------------+    +--------------------------+
```

- Replay the test

```text
+-------------+    +--------------------+
| HTTP Client | => | Run it as Replayer |
+-------------+    +--------------------+
```

- Check in the record file `<name>.json` (by default, it's `default.json`) to your version control, and you can always use step 2 to re-test your app/code, without any external server dependencies

## Basic usage

### Command line

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

### Use as node.js module

```javascript
let Runner = require('../runner')
// option has properties that are the same a `yargs` argv
// i.e. the property names are arguments key name camelized
let option = {name: 'demo', target: 'https://jsonplaceholder.typicode.com'}
let replayer = new Runner(option, printer)
replayer.listFormat()
replayer.record()
```


## Storage format

### Currently implemented

#### JSON : [Schema here](storer/json_storer.schema.json)

### Planned (unimplemented)

### SQLite
