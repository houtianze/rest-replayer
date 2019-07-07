const Constant = require('./constant')

const debug = require('debug')(Constant.AppName + ':storer')

class Storer {
    normalizeReqProp(reqProp) {
        reqProp.query.sort()
        const headerNames = []
        for (let name in reqProp.headers) {
            if (reqProp.headers.hasOwnProperty(name)) {
                headerNames.push(name)
            }
        }
        reqProp.sortedHeader = []
        headerNames.sort()
        reqProp.sortedHeader = headerNames.sort().map(name => {
            var header = {}
            header[name] = reqProp.headers[name]
            return header
        })
    }

    getKeyString(reqProp) {
        var keyString = `path:${reqProp.path}\nquery:${reqProp.query}\nheaders:${reqProp.headers}\nbody:${reqProp.body}`
        return keyString
    }

    store(resProp, reqProp, backend) {
        // {path,  query, headers, body}
        this.normalizeReqProp(reqProp)
        debug(`req prop: ${reqProp}`)
        debug(`res prop: ${resProp}`)
        var keyString = this.getKeyString(reqProp)
        debug(`normalized request prop as string: ${keyString}`)
        return backend.store(resProp, reqProp, keyString)
    }

    retrieve(reqProp, backend) {
        this.normalizeReqProp(reqProp)
        debug(`req prop: ${reqProp}`)
        var keyString = this.getKeyString(reqProp)
        debug(`normalized request prop as string: ${keyString}`)
        return backend.retrieve(reqProp, keyString)
    }
}

module.exports = new Storer()