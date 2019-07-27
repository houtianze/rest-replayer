const Constant = require('./constant')

const debug = require('debug')(Constant.AppName + ':storer')

class Storer {
    normalizeReqProp(reqProp) {
        reqProp.query.sort()
        const headerNames = []
        for (let name in reqProp.headers) {
            // TODO: better/customizable handling of "ignorable" headers
            if (reqProp.headers.hasOwnProperty(name)
                && name !== 'user-agent'
                && name !== 'etag'
                && name !== 'if-non-match') {
                headerNames.push(name)
            }
        }
        headerNames.sort()
        reqProp.sortedHeaders = headerNames.map(name => {
            var header = {}
            header[name] = reqProp.headers[name]
            return header
        })
        reqProp.base64Body = Buffer.from(reqProp.body).toString('base64')
    }

    getKeyString(reqProp) {
        var keyString = `path:${reqProp.path}\nquery:${reqProp.query}\nheaders:${JSON.stringify(reqProp.sortedHeaders)}\nbody:${reqProp.base64Body}`
        return keyString
    }

    store(resProp, reqProp, backend) {
        // {path,  query, headers, body}
        this.normalizeReqProp(reqProp)
        debug(`req prop: ${reqProp}`)
        debug(`res prop: ${resProp}`)
        const keyString = this.getKeyString(reqProp)
        debug(`[store] normalized request key: ${keyString}`)
        return backend.store(resProp, reqProp, keyString)
    }

    retrieve(reqProp, backend) {
        this.normalizeReqProp(reqProp)
        debug(`req prop: ${reqProp}`)
        var keyString = this.getKeyString(reqProp)
        debug(`[retrieve] normalized request key: ${keyString}`)
        return backend.retrieve(reqProp, keyString)
    }
}

module.exports = new Storer()