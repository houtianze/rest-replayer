#!/usr/bin/env node

const Constant = require('./constant')
const debug = require('debug')(Constant.AppName + ':main')
const runner = require('./runner')

const yargsArgv = require('yargs')
  .scriptName(Constant.AppName)
  .usage('$0 <cmd> [args]')
  .command('record [args]',
    'Record http/rest traffics',
    (yargs) => {
      yargs.option('target', {
        type: 'string',
        alias: 't',
        require: true,
        describe: 'Target URL to get response from'
      })
    },
    runner.record)
  .command(
    'replay [args]',
    'Replay http/rest traffics',
    (yargs) => { },
    runner.replay)
  .command('list-format [args]',
    'List all supported storage formats',
    (yargs) => { },
    runner.listFormat)
  .command('delete [args]',
    'Delete storage for the given record name & format',
    (yargs) => {},
    runner.delete)
  .command('purge [args]',
    'Purge all records for the format',
    (yargs) => { },
    runner.purge)
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
    describe: "Storage format. (To see all formats, please use the 'list-format' command)"
  })
  .option('storage-dir', {
    type: 'string',
    default: './storage',
    describe: `Storage directory`
  })
  .option('insecure', {
    type: 'boolean',
    alias: 'k',
    default: false,
    describe: 'Disable the https certificate verifiation'
  })
  .option('yes', {
    type: 'boolean',
    alias: 'y',
    default: false,
    describe: "Answer yes for all confirmations (like 'delete', 'purge')"
  })
  .help()
  .argv

debug('arguments:', yargsArgv)
