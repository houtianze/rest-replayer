const Constant = require('./constant')

const debug = require('debug')(Constant.AppName + ':storer')

class Storer {
    store(res, reqProp, backend) {
        // {path,  query, headers, body}
        function normalize(opt) {
            opt.query.sort()
            const headerNames = []
            for (let name in opt.headers) {
                if (opt.headers.hasOwnProperty(name)) {
                    headerNames.push(name)
                }
            }
            opt.sortedHeader = []
            headerNames.sort()
            opt.sortedHeader = headerNames.sort().map(name => {
                var header = {}
                header[name] = opt.headers[name]
                return header
            })
        }
        normalize(reqProp)
        debug(`request properties: ${reqProp}`)
        var keyString = `path:${reqProp.path}\nquery:${reqProp.query}\nheaders:${reqProp.headers}\nbody:${reqProp.body}`
        debug(`normalized request prop as string: ${keyString}`)
        return backend.store(res, reqProp, keyString)
    }
}

module.exports = new Storer()