const http = require('http')

const Constant = require('./constant')
const debug = require('debug')(Constant.AppName + ':replayer')
const Storer = require('./storer')

function replay(port, storerBackend) {
    function run() {
        let storer = new Storer(storerBackend)
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

                // TODO: a more grace solution
                delete req.headers.host
                let reqProp = {
                    path: reqUrl.pathname,
                    query: reqUrl.searchParams,
                    headers: req.headers,
                    body: reqBody
                }
                let resProp = storer.retrieve(reqProp)
                if (resProp) {
                    res.writeHead(resProp.statusCode, resProp.headers)
                    res.end(resProp.body)
                } else {
                    res.statusCode = 404
                    res.end(Constant.error.RespNotFound)
                }
            })
        }).listen(port)

        debug(`Replayer is listening on port ${port}.`)
    }

    run()
}

module.exports = replay