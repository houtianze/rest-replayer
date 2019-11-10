const rl = require('linebyline');
const Constant = require('./constant');

class Helper {
    setObjectDefaultValues(dst, src) {
        dst = dst || {}
        let srcCopy = Object.assign({}, src)
        Object.assign(srcCopy, dst)
        return Object.assign(dst, srcCopy)
    }

    // https://coderwall.com/p/v16yja/simple-node-js-prompt
    ask(question) {
        const promise = new Promise((resolve) => {
            const ri = rl.createInterface({
                input: process.stdin,
                output: process.stdout})
            ri.question(question + '\n', function(answer) {
                ri.close()
                resolve(answer)
            });
        })
        return promise
    }

    confirm(question, yes, callback) {
        if (yes) {
            return callback()
        } else {
            this.ask(question).then(ans => {
                const ansLower = ans.toLowerCase()
                if (ansLower === 'y' || ansLower === 'yes') {
                    return callback()
                }
            })
        }
        return false
    }

    cleanHeaders(headers, override) {
        if (!override) {
            override = []
        }

        if (!override.mustRemove) {
            override.mustRemove = []
        }

        if (!override.mustKeep) {
            override.mustKeep = []
        }
        // mustKeep take precedences over mustRemove
        var defaultRemovedHeaderNames = Constant.ForbiddenHeaderNames.concat(Constant.DefaultRemovedHeaderNames).concat(override.mustRemove)
        defaultRemovedHeaderNames.forEach(header => {
            if (!override.mustKeep) {
                delete headers[header]
            }
        })
    }
}

module.exports = new Helper()
