// https://www.npmjs.com/package/global-agent#usage
// Import global-agent/bootstrap.
// Export HTTP proxy address as GLOBAL_AGENT_HTTP_PROXY environment variable.
require('global-agent/bootstrap')

const path= require('path')
const fs = require('fs-extra')

const Constant = require('./constant')
const Storage = require('./storage')
const debug = require('debug')(Constant.AppName + ':runner')
const helper = require('./helper')

const RecordNamePattern = /^[_.0-9a-zA-Z]+$/

function getAllStorerFormats() {
    const formats = fs.readdirSync(Constant.StorerDir)
    .filter(name => {
        return fs.statSync(`${Constant.StorerDir}${path.sep}${name}`).isFile() && name.endsWith(Constant.StorerSuffixWithExtension)
    }).map(name => {
        return name.substr(0, name.length - Constant.StorerSuffixWithExtension.length)
    })
    return formats
}

function getStorerBackend(storage) {
    const backendModulePath = `${Constant.StorerDir}${path.sep}${storage.format}${Constant.StorerSuffixWithExtension}`
    debug(`storer backend: ${backendModulePath}`)
    const StorerBackend = require(backendModulePath)
    const storerBackend = new StorerBackend(storage)
    return storerBackend
}

function prepare(option, printer) {
    me.printer = printer

    option = helper.setObjectDefaultValues(option, Constant.DefaultConfig)
    debug('constructed with option:', option)
    if (!validateRecordName(option.name)) {
        const err = `Invalidate record name '${option.name}'! (must match pattern: ${RecordNamePattern})`
        me.printer.e(err)
        throw err
    }

    if (option.insecure) {
        // For https request recording, we need to disable cert verifications
        // This is quick and dirty, check the corresponding SO thread for more information
        // https://stackoverflow.com/a/20497028/404271
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    me.option = option
    me.storage = new Storage(option.storageDir, option.format, option.name)
    me.storerBackend = getStorerBackend(me.storage)
}

function validateRecordName(name) {
    return RecordNamePattern.test(name)
}

var me
class Runner {
    constructor(option, printer) {
        me = this
        prepare(option, printer)
    }

    record() {
        me.storage.init().then(
            require('./recorder')(me.option.port, me.option.target, me.storerBackend)
        )
    }

    replay() {
        me.storage.init().then(
            require('./replayer')(me.option.port, me.storerBackend)
        )
    }

    listFormat() {
        let formats = getAllStorerFormats()
        me.printer.i(`supported formats: ${formats}`)
        return formats
    }

    deleteRecord() {
        helper.confirm(`Are you sure you want to delete record '${me.option.name}' for format '${me.option.format}'?`,
            me.option.yes,
            me.storerBackend.deleteRecord,
            me.printer.i(`Record '${me.option.name}' for format '${me.option.format}' has been deleted.`)
        )
    }

    purge() {
        helper.confirm(`Are you sure you want to purge all records for format '${me.option.format}'?`,
            me.option.yes,
            () => me.storage.purge().then(me.printer.i(`Files for format '${me.option.format}' has been purged.`))
        )
    }
}

module.exports = Runner
