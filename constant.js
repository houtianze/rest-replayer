const path = require('path')

module.exports = {
    AppName: 'rest-replayer',
    StorerDir: `${__dirname}${path.sep}storer`,
    StorerSuffixWithExtension: '_storer.js',
    DefaultRecordName: 'default',
    error: {
        RespNotFound: 'REST-Replayer response NOT found'
    }
}