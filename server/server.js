// const Koa = require('koa')
const express = require('express')
const favicon = require('serve-favicon')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
// const serve = require('koa-static')

const isDev = process.env.NODE_ENV === 'development'

// const app = new Koa()
const app = express()

app.use(favicon(path.join(__dirname, '../favicon.ico')))
if (!isDev) {
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')

  const serverEntry = require('../dist/server-entry').default

  // app.use(serve(path.join(__dirname, '../dist/public')))

  // app.use(async ctx => {

  //     appString = await ReactSSR.renderToString(serverEntry)

  //     ctx.body = template.replace('<!-- app -->', appString)

  // })
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<!-- app -->', appString))
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.listen(2333, () => console.log('server is listening on 2333'))
