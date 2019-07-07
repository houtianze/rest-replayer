const http = require('http')
const https = require('https')

const express = require('express')
const cors = require('cors')
const proxy = require('http-proxy-middleware')
const app = express()

const Constant = require('./constant')
const debug = require('debug')(Constant.AppName + ':recorder')
const storer = require('./storer')

function record(port, target, storerBackend) {
    function onProxyReq(proxyRes, req, res) {
        return
        // debug('onProxyReq', proxyRes, req, res)
        const dummyBase = 'http://localhost'
        let reqUrl = new URL(req.url, dummyBase)
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
            storer.store({
                path: reqUrl.pathname,
                query: reqUrl.searchParams,
                headers: req.headers,
                body: reqBody
            }, storerBackend)
        })
    }

    function onProxyRes(proxyRes, req, res) {
        // debug('onProxyRes', proxyRes, req, res)
        const dummyBase = 'http://localhost'
        let reqUrl = new URL(req.url, dummyBase)
        let proxyResBodyChunks = []
        // debug(`onProxyRes:\nreq:${Object.keys(req)}\nres:${Object.keys(proxyRes)}\n${proxyRes}\nmethod:${req.method}\nheaders:${req.headers}\nurl:${reqUrl}`)
        debug(`onProxyRes:\nreq:${Object.keys(req.client)}\n${Object.keys(req)}`)
        req.client.on('data', (chunk) => {
            console.log('reqc:', chunk)
        })
        proxyRes.on('data', (chunk) => {
            proxyResBodyChunks.push(chunk)
        })
        .on('end', () => {
            let reqBody = Buffer.concat(proxyResBodyChunks)
            reqBodyChuks = []
            debug(reqBody)
            reqUrl.searchParams.forEach((value, name) => {
                debug(name, value)
            })
            storer.store({
                path: reqUrl.pathname,
                query: reqUrl.searchParams,
                headers: req.headers,
                body: reqBody
            }, storerBackend)
        })
    }

    // proxy middleware options
    const proxyOption = {
        target: target, // target host
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        logLevel: 'debug',
        pathRewrite: {
            // '^/api/old-path': '/api/new-path', // rewrite path
            // '^/api/remove/path': '/path' // remove base path
        },
        router: {
            // when request.headers.host == 'dev.localhost:3000',
            // override target 'http://www.example.org' to 'http://localhost:8000'
            // 'dev.localhost:3000': 'http://localhost:8000'
        },
        // proxyTimeout: 5000
        onProxyReq: onProxyReq,
        onProxyRes: onProxyRes
    };

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
    }
    // const recorderProxy = proxy(proxyOption)
    // app.use('/', recorderProxy)
    // app.use(cors())

    // app.listen(port, () => debug(`Recorder is listening on port ${port}.`))
    run()
}

module.exports = record