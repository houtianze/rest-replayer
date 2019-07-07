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
            // debug('onProxyReq', proxyRes, req, res)
            debug(req.url, target)
            let reqUrl = new URL(req.url, target)
            let reqBodyChunks = []
            debug('onProxyReq', req.method, req.headers, Array.isArray(req.headers['set-cookie']) , reqUrl)
            req.on('data', (chunk) => {
                reqBodyChunks.push(chunk)
            })
            .on('end', () => {
                let reqBody = Buffer.concat(reqBodyChunks)
                reqBodyChuks = []
                debug(reqBody)
                reqUrl.searchParams.forEach((value, name) => {
                    debug(name, value)
                })
                let reqOption = {
                    method: req.method,
                    headers: req.headers,
                }
                let targetReq = httpHttps.request(reqUrl, reqOption, targetRes => {
                    let targetResBodyChunks = []
                    targetRes.on('data', chunk => {
                        targetResBodyChunks.push(chunk)
                    })
                    targetRes.on('end', () => {
                        let targetResBody = Buffer.concat(targetResBodyChunks)
                        debug(targetRes.statusCode)
                        debug(targetRes.headers)
                        debug(targetResBody)
                        res.writeHead(targetRes.statusCode, targetRes.headers)
                        res.end(targetResBody)
                    })
                    storer.store(targetRes, {
                        path: reqUrl.pathname,
                        query: reqUrl.searchParams,
                        headers: req.headers,
                        body: reqBody
                    }, storerBackend)
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