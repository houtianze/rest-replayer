const fs = require('fs-extra')
const path = require('path')

module.exports = class Storage {
    constructor(rootDir, format, name) {
        this.rootDir = rootDir
        this.format = format
        this.name = name
        this.formatRootDir = path.join(this.rootDir, this.format)
    }

    init() {
        return fs.ensureDir(this.formatRootDir)
    }

    purge() {
        return fs.emptyDir(this.formatRootDir)
    }
}
