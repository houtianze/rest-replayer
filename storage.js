const fs = require('fs-extra')
const path = require('path')

module.exports = class Storage {
    constructor(rootDir, name, format) {
        this.rootDir = rootDir
        this.name = name
        this.format = format
    }

    init() {
        return fs.ensureDir(path.join(this.rootDir, this.format))
    }
}