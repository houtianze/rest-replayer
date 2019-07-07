const http = require('http')
const https = require('https')

const Constant = require('./constant')
const debug = require('debug')(Constant.AppName + ':recorder')
const storer = require('./storer')

function record(port, target, storerBackend) {
    function run() {
        let targetUrl = new URL(target)
        let httpHttps = http
        if (targetUrl.protocol === 'http:') {
            httpHttps = http
        } else if (targetUrl.protocol === 'https:') {
            httpHttps = https
        }

        http.createServer((req, res) => {
            debug("req url:", req.url)
            let reqUrl = new URL(req.url, target)
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
                let reqOption = {
                    method: req.method,
                    headers: req.headers,
                }
                // TODO: submit PR for global-agent, it has to deal with `URL` and `string`
                // You have to use reqUrl.href if you are using global-agent
                let targetReq = httpHttps.request(reqUrl, reqOption, targetRes => {
                    let targetResBodyChunks = []
                    targetRes.on('data', chunk => {
                        targetResBodyChunks.push(chunk)
                    })
                    targetRes.on('end', () => {
                        let targetResBody = Buffer.concat(targetResBodyChunks)
                        debug(`res: status: ${targetRes.statusCode}; headers: ${targetRes.headers}`)
                        debug("res body: ", targetResBody.toString())
                        res.writeHead(targetRes.statusCode, targetRes.headers)
                        res.end(targetResBody)

                        let resProp = {
                            statusCode: targetRes.statusCode,
                            headers: JSON.stringify(targetRes.headers),
                            body: targetResBody.toString()
                        }
                        let reqProp = {
                            path: reqUrl.pathname,
                            query: reqUrl.searchParams,
                            headers: req.headers,
                            body: reqBody.toString()
                        }
                        storer.store(resProp, reqProp, storerBackend)
                    })
                })
                targetReq.on('error', err => {
                    res.end(err)
                })
                targetReq.write(reqBody)
                targetReq.end()
            })
        }).listen(port)

        debug(`Recorder is listening on port ${port}.`)
    }

    run()
}

module.exports = record