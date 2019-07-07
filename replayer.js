const http = require('http')

const Constant = require('./constant')
const debug = require('debug')(Constant.AppName + ':replayer')
const storer = require('./storer')

function replay(port, storerBackend) {
    function run() {
        http.createServer((req, res) => {
            debug("req url:", req.url)
            const dummyHost = 'http://localhost'
            let reqUrl = new URL(req.url, dummyHost)
            let reqBodyChunks = []
            req.on('data', (chunk) => {
                reqBodyChunks.push(chunk)
            })
            .on('end', () => {
                let reqBody = Buffer.concat(reqBodyChunks)
                reqBodyChuks = []
                debug("req body: ", reqBody.toString())
                reqUrl.searchParams.forEach((value, name) => {
                    debug(`req param: ${name}=${value}`)
                })

                let reqProp = {
                    path: reqUrl.pathname,
                    query: reqUrl.searchParams,
                    headers: req.headers,
                    body: reqBody.toString()
                }
                let resProp = storer.retrieve(reqProp, storerBackend)
                if (resProp) {
                    res.writeHead(resProp.statusCode, JSON.parse(resProp.headers))
                    res.end(resProp.body)
                } else {
                    res.statusCode = 404
                    res.end('NOT Found')
                }
            })
        }).listen(port)

        debug(`Replayer is listening on port ${port}.`)
    }

    run()
}

module.exports = replay