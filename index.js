#!/usr/bin/env node

// For https request recording, we need to disable cert verifications
// This is quick and dirty, check the corresponding SO thread for more information
// https://stackoverflow.com/a/20497028/404271
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// https://www.npmjs.com/package/global-agent#usage
// Import global-agent/bootstrap.
// Export HTTP proxy address as GLOBAL_AGENT_HTTP_PROXY environment variable.
require('global-agent/bootstrap')

const path= require('path')

const Storage = require ('./storage')
const record = require ('./recorder')
const replay = require ('./replayer')
const Constant = require('./constant')
const debug = require('debug')(Constant.AppName + ':index')

const argv = require('yargs')
  .scriptName(Constant.AppName)
  .usage('$0 <cmd> [args]')
  .command('record [args]', 'Record http/rest traffics', (yargs) => {
    yargs.option('target', {
      type: 'string',
      alias: 't',
      require: true,
      describe: 'Target URL to get response from'
    })
  }, function (argv) {
    debug('recording with options:', argv)
    debug(`recording using: storage dir: ${argv.storageDir}; name: ${argv.name}; format: ${argv.format}`)
    let storage = new Storage(argv.storageDir, argv.name, argv.format)
    const StorerBackend = require(chooseStorerBackend(argv.format))
    storage.init().then(
      record(argv.port, argv.target, new StorerBackend(storage))
    )
  })
  .command('replay [args]', 'Replay http/rest traffics', (yargs) => {
  }, function (argv) {
    debug('replaying with options:', argv)
    debug(`replaying using: storage dir: ${argv.storageDir}; name: ${argv.name}; format: ${argv.format}`)
    let storage = new Storage(argv.storageDir, argv.name, argv.format)
    const StorerBackend = require(chooseStorerBackend(argv.format))
    storage.init().then(
      replay(argv.port, new StorerBackend(storage))
    )
  })
  .option('name', {
      type: 'string',
      alias: 'n',
      default: Constant.DefaultRecordName,
      require: false,
      describe: 'Name of the record'
  })
  .option('port', {
    type: 'int',
    alias: 'p',
    default: 43210,
    describe: `The port for ${Constant.AppName} to listen on`
  })
  .option('format', {
    type: 'string',
    alias: 'f',
    default: 'json',
    describe: `Storage format`
  })
  .option('storage-dir', {
    type: 'string',
    default: './storage',
    describe: `Storage directory`
  })
  .help()
  .argv

function chooseStorerBackend(format) {
    let backend = `${__dirname}/storer${path.sep}${format}_storer.js`
    debug(`storer: ${backend}`)
    return backend
}