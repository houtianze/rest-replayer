const path = require('path')
const fs = require('fs')

const Constant = require('../constant')
const jsonSchemaValidate = require('jsonschema').validate
const debug = require('debug')(Constant.AppName + ':json_storer')

const pr = require('../printer')

var me
class JsonStorer {
    constructor(storage) {
        me = this
        me.storage = storage
        me.jsonFile = `${storage.formatRootDir}${path.sep}${storage.name}.json`
        debug('json storage file:' , me.jsonFile)
        try {
            let json = fs.readFileSync(me.jsonFile)
            me.db = JSON.parse(json.toString())
        } catch (ex) {
            me.db = me.createStorageJson()
        }
        const schema = JSON.parse(fs.readFileSync(`${__dirname}${path.sep}json` +
            `${Constant.StorerSuffixWithExtension.substr(
                0, Constant.StorerSuffixWithExtension.lastIndexOf('.'))}` +
            `.schema.json`).toString());
        let validationResult = jsonSchemaValidate(me.db, schema)
        if (!validationResult.valid) {
            let err = `Invalid JSON file: ${me.jsonFile}!\nValidation error: ${validationResult}`
            pr.e(err)
            throw err
        }
    }

    createStorageJson() {
        return {
            version: 1,
            name: me.storage.name,
            responseRetention: 'latest',
            mapping: {}
        }
    }

    // stringify and base64 to better handle binary responses
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
                body: Constant.error.RespNotFound
            }
        }
        let res = JSON.parse(resString)
        res.headers = JSON.parse(res.headers)
        res.body = Buffer.from(res.body, 'base64')
        return res
    }

    store(resProp, reqProp, keyString) {
        me.db.mapping[keyString] = {
            request: reqProp,
            response: me.stringifyResProp(resProp)
        }
        return true
    }

    persist() {
        fs.writeFileSync(me.jsonFile, JSON.stringify(me.db))
    }

    retrieve(reqProp, keyString) {
        if(!me.db.mapping[keyString] || !me.db.mapping[keyString].response) {
            return null
        }
        return me.parseResPropString(me.db.mapping[keyString].response)
    }

    deleteRecord() {
        fs.unlinkSync(me.jsonFile)
    }
}

module.exports = JsonStorer