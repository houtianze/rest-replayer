const path = require('path')
const fs = require('fs')

const Constant = require('../constant')
const jsonSchemaValidate = require('jsonschema').validate
const debug = require('debug')(Constant.AppName + ':json_storer')

const pr = require('../printer')

class JsonStorer {
    constructor(storage) {
        const me = this
        this.storage = storage
        this.jsonFile = `${storage.formatRootDir}${path.sep}${storage.name}.json`
        debug('json storage file:' , this.jsonFile)
        try {
            let json = fs.readFileSync(this.jsonFile)
            me.db = JSON.parse(json.toString())
        } catch (ex) {
            me.db = this.createStorageJson()
        }
        const schema = JSON.parse(fs.readFileSync(`${__dirname}${path.sep}json` +
            `${Constant.StorerSuffixWithExtension.substr(
                0, Constant.StorerSuffixWithExtension.lastIndexOf('.'))}` +
            `.schema.json`).toString());
        let validationResult = jsonSchemaValidate(me.db, schema)
        if (!validationResult.valid) {
            let err = `Invalid JSON file: ${this.jsonFile}!\nValidation error: ${validationResult}`
            pr.e(err)
            throw err
        }
    }

    createStorageJson() {
        return {
            version: 1,
            name: this.storage.name,
            responseRetention: 'latest',
            mapping: {}
        }
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
        this.db.mapping[keyString] = this.stringifyResProp(resProp)
        fs.writeFileSync(this.jsonFile, JSON.stringify(this.db))
        return true
    }

    retrieve(reqProp, keyString) {
        return this.parseResPropString(this.db.mapping[keyString])
    }

    deleteRecord() {
        fs.unlinkSync(this.jsonFile)
    }
}

module.exports = JsonStorer