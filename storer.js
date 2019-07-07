const Constant = require('./constant')

const debug = require('debug')(Constant.AppName + ':storer')

class Storer {
    store(option, backend) {
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
        normalize(option)
        debug(option)
        var keyString = `path:${option.path}\nquery:${option.query}\nheaders:${option.headers}\nbody:${option.body}`
        debug(keyString)
        return backend.store(option, keyString)
    }
}

module.exports = new Storer()