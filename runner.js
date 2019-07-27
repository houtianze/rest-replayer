// https://www.npmjs.com/package/global-agent#usage
// Import global-agent/bootstrap.
// Export HTTP proxy address as GLOBAL_AGENT_HTTP_PROXY environment variable.
require('global-agent/bootstrap')

const path= require('path')
const fs = require('fs-extra')

const Constant = require('./constant')
const Storage = require('./storage')
const debug = require('debug')(Constant.AppName + ':runner')
const pr = require('./printer')
const helper = require('./helper')

function getAllStorerFormats() {
    const formats = fs.readdirSync(Constant.StorerDir)
    .filter(name => {
        return fs.statSync(`${Constant.StorerDir}${path.sep}${name}`).isFile() && name.endsWith(Constant.StorerSuffixWithExtension)
    }).map(name => {
        return name.substr(0, name.length - Constant.StorerSuffixWithExtension.length)
    })
    pr.i(`supported formats: ${formats}`)
    return formats
}

function getStorerBackend(storage) {
    const backendModulePath = `${Constant.StorerDir}${path.sep}${storage.format}${Constant.StorerSuffixWithExtension}`
    debug(`storer backend: ${backendModulePath}`)
    const StorerBackend = require(backendModulePath)
    const storerBackend = new StorerBackend(storage)
    return storerBackend
}

function prepare(option) {
    if (option.insecure) {
        // For https request recording, we need to disable cert verifications
        // This is quick and dirty, check the corresponding SO thread for more information
        // https://stackoverflow.com/a/20497028/404271
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    const storage = new Storage(option.storageDir, option.format, option.name)
    const storerBackend = getStorerBackend(storage)
    return {
        storage: storage,
        storerBackend: storerBackend
    }
}

class Runner {
    record(option) {
        let store = prepare(option)
        store.storage.init().then(
            require('./recorder')(option.port, option.target, store.storerBackend)
        )
    }

    replay(option) {
        let store = prepare(option)
        store.storage.init().then(
            require('./replayer')(option.port, store.storerBackend)
        )
    }

    listFormat() {
        getAllStorerFormats().forEach(pr.i)
    }

    delete(option) {
        let store = prepare(option)
        helper.confirm(`Are you sure you want to delete record '${option.name}' for format '${option.format}'?`,
            option.yes,
            store.storerBackend.delete,
            pr.i(`Record '${option.name}' for format '${option.format}' has been deleted.`)
        )
    }

    purge(option) {
        let store = prepare(argv)
        helper.confirm(`Are you sure you want to purge all records for fomart '${argv.format}'?`,
            argv.yes,
            () => store.storage.purge().then(pr.i(`Files for format '${argv.format}' has been purged.`))
        )
    }
}

module.exports = new Runner()
