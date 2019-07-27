const rl = require('readline');

class Helper {
    // https://coderwall.com/p/v16yja/simple-node-js-prompt
    ask(question) {
        const promise = new Promise((resolve, reject) => {
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
            callback()
        } else {
            this.ask(question).then(ans => {
                const ansLower = ans.toLowerCase()
                if (ansLower === 'y' || ansLower === 'yes') {
                    callback()
                }
            })
        }
    }
}

module.exports = new Helper()
