const path = require('path')
const fs = require('fs')

const Constant = require('../constant')
const debug = require('debug')(Constant.AppName + ':json_storer')

class JsonStorer {
    constructor(storage) {
        const me = this
        this.storage = storage
        this.jsonFile = `${storage.rootDir}${path.sep}storage.json`
        debug('json storage file:' , this.jsonFile)
        // fs.readFile(this.jsonFile, (err, data) => {
        //     if (err) {
        //         me.db = {}
        //     } else {
        //         try {
        //             me.db = JSON.parse(data.toString())
        //         } catch (ex){
        //             me.db = {}
        //         }
        //     }
        //     if (!me.db[storage.name]) {
        //         me.db[storage.name] = {}
        //     }
        //     me.table = me.db[storage.name]
        // })
        try {
            let json = fs.readFileSync(this.jsonFile)
            me.db = JSON.parse(json.toString())
        } catch (ex) {
            me.db = {}
        }
        if (!me.db[storage.name]) {
            me.db[storage.name] = {}
        }
        me.table = me.db[storage.name]
    }

    stringifyResProp(resProp) {
        return JSON.stringify({
            statusCode: resProp.statusCode,
            headers: JSON.stringify(resProp.headers),
            body: Buffer.from(resProp.body).toString('base64')
        })
    }

    parseResPropString(resString) {
        if (!resString) {
            return {
                statusCode: 404,
                headers: {},
                body: 'Not Found'
            }
        }
        let res = JSON.parse(resString)
        res.headers = JSON.parse(res.headers)
        res.body = Buffer.from(res.body, 'base64')
        return res
    }

    store(resProp, reqProp, keyString) {
        this.table[keyString] = this.stringifyResProp(resProp)
        // fs.writeFile(this.jsonFile, JSON.stringify(this.db), err => {
        //     if (err) {
        //         debug('writeFile error:', err)
        //     }
        // })
        fs.writeFileSync(this.jsonFile, JSON.stringify(this.db))
        return true
    }

    retrieve(reqProp, keyString) {
        return this.parseResPropString(this.table[keyString])
    }
}

module.exports = JsonStorer