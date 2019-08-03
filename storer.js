const Constant = require('./constant')

const debug = require('debug')(Constant.AppName + ':storer')

var me
class Storer {
    constructor(backend) {
        me = this
        me.backend = backend
        this.lastSaveTime = this.getMsSinceEpoch()
        process.on('SIGINT', function() {
            debug('Interrupted, saving req/res mappings...')
            me.persist()
            debug('Saving done')
            process.exit()
        });
    }

    getMsSinceEpoch() {
        return (new Date()).getTime()
    }

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

    store(resProp, reqProp) {
        // {path,  query, headers, body}
        this.normalizeReqProp(reqProp)
        debug(`req prop: ${reqProp}`)
        debug(`res prop: ${resProp}`)
        const keyString = this.getKeyString(reqProp)
        debug(`[store] normalized request key: ${keyString}`)
        let r = this.backend.store(resProp, reqProp, keyString)
        let now = this.getMsSinceEpoch()
        if (now - this.lastSaveTime > Constant.SavingIntervalInSeconds * 1000) {
            persist()
            this.lastSaveTime = now
        }
        return r
    }

    persist() {
        debug('persisting JSON')
        let r = this.backend.persist()
        debug('JSON persisted')
        return r
    }

    retrieve(reqProp) {
        this.normalizeReqProp(reqProp)
        debug(`req prop: ${reqProp}`)
        var keyString = this.getKeyString(reqProp)
        debug(`[retrieve] normalized request key: ${keyString}`)
        return this.backend.retrieve(reqProp, keyString)
    }
}

module.exports = Storer