const path= require('path')

const Storage = require ('./storage')
const record = require ('./recorder')
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
    debug('recording to:', argv.storageDir, argv.name, argv.format)
    let storage = new Storage(argv.storageDir, argv.name, argv.format)
    const storerBackend = require(chooseStorerBackend(argv.format))
    storage.init().then(
      record(argv.port, argv.target, storerBackend)
    )
  })
  .command('replay [args]', 'Replay http/rest traffics', (yargs) => {
  }, function (argv) {
    debug('replaying', argv, 'yo!')
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
    default: 'json'
  })
  .option('storage-dir', {
    type: 'string',
    default: './storage'
  })
  .help()
  .argv

function chooseStorerBackend(format) {
    let backend = `./storer${path.sep}${format}_storer.js`
    debug('storer', backend)
    return backend
}
// debug(argv)
// require('global-agent/bootstrap')
