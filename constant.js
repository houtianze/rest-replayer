const path = require('path')

module.exports = {
    // fixed app properties
    AppName: 'rest-replayer',
    StorerDir: `${__dirname}${path.sep}storer`,
    StorerSuffixWithExtension: '_storer.js',
    SavingIntervalInSeconds: 300,


    // app constants
    error: {
        RespNotFound: 'REST-Replayer response NOT found'
    },

    // default config values
    DefaultPort: 43210,
    DefaultRecordName: 'default',
    DefaultRecordFormat: 'json',
    DefaultStorageDirectory: `.${path.sep}storage`,
    DefaultInsecure: false,
    DefaultYesToProceed: false,

    // default config object
    // https://stackoverflow.com/a/4616262/404271
    get DefaultConfig() {
        return {
            port: this.DefaultPort,
            name: this.DefaultRecordName,
            format: this.DefaultRecordFormat,
            storageDir: this.DefaultStorageDirectory,
            insecure: this.DefaultInsecure,
            yes: this.DefaultYesToProceed
        }
    }
}