const path = require('path')

module.exports = {
    // fixed app properties
    AppName: 'rest-replayer',
    StorerDir: `${__dirname}${path.sep}storer`,
    StorerSuffixWithExtension: '_storer.js',
    SavingIntervalInSeconds: 300,

    // factual constants
    // https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
    ForbiddenHeaderNames: [
        'Accept-Charset',
        'Accept-Encoding',
        'Access-Control-Request-Headers',
        'Access-Control-Request-Method',
        'Connection',
        'Content-Length',
        'Cookie',
        'Cookie2',
        'Date',
        'DNT',
        'Expect',
        'Host',
        'Keep-Alive',
        'Origin',
        'Proxy-',
        'Sec-',
        'Referer',
        'TE',
        'Trailer',
        'Transfer-Encoding',
        'Upgrade',
        'Via',
    ].map(x => x.toLowerCase()),
    DefaultRemovedHeaderNames: [
        'User-Agent',
        'ETag',
        'If-None-Match'
    ].map(x => x.toLowerCase()),

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