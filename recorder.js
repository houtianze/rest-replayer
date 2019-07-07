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
    const recorderProxy = proxy(proxyOption)
    app.use('/', recorderProxy)
    app.use(cors())

    app.listen(port, () => debug(`Recorder is listening on port ${port}.`))
}

module.exports = record