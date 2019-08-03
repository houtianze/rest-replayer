#!/usr/bin/env node

const Constant = require('./constant')
const debug = require('debug')(Constant.AppName + ':main')
const printer = require('./printer')
const Runner = require('./runner')

const yargsArgv = require('yargs')
  .scriptName(Constant.AppName)
  .usage('$0 <cmd> [args]')
  .command('record [args]',
    'Record http/rest traffics',
    yargs => {
      yargs.option('target', {
        type: 'string',
        alias: 't',
        require: true,
        describe: 'Target URL to get response from'
      })
    },
    yargs => { return new Runner(yargs, printer).record() } )
  .command(
    'replay [args]',
    'Replay http/rest traffics',
    yargs => { },
    yargs => { return new Runner(yargs, printer).replay() } )
  .command('list-format [args]',
    'List all supported storage formats',
    yargs => { },
    yargs => { return new Runner(yargs, printer).listFormat() } )
  .command('delete [args]',
    'Delete storage for the given record name & format',
    yargs => {},
    yargs => { return new Runner(yargs, printer).deleteRecord() } )
  .command('purge [args]',
    'Purge all records for the format',
    yargs => { },
    yargs => { return new Runner(yargs, printer).purge() } )
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
    default: Constant.DefaultPort,
    describe: `The port for ${Constant.AppName} to listen on`
  })
  .option('format', {
    type: 'string',
    alias: 'f',
    default: Constant.DefaultRecordFormat,
    describe: "Storage format. (To see all formats, please use the 'list-format' command)"
  })
  .option('storage-dir', {
    type: 'string',
    default: Constant.DefaultStorageDirectory,
    describe: `Storage directory`
  })
  .option('insecure', {
    type: 'boolean',
    alias: 'k',
    default: Constant.DefaultInsecure,
    describe: 'Disable the https certificate verification'
  })
  .option('yes', {
    type: 'boolean',
    alias: 'y',
    default: Constant.DefaultYesToProceed,
    describe: "Answer yes for all confirmations (like 'delete', 'purge')"
  })
  .help()
  .argv

debug('arguments:', yargsArgv)
