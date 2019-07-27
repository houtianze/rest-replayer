const chalk = require('chalk')

class Printer {
    p(msg) {
        console.log(msg)
    }

    i(msg) {
        console.log(chalk.green(msg))
    }

    w(msg) {
        console.log(chalk.yellowBright(msg))
    }

    e(msg) {
        console.log(chalk.redBright(msg))
    }
}

module.exports = new Printer()
