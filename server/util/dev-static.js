const axios = require('axios')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const ReactDomServer = require('react-dom/server')
const path = require('path')
const proxy = require('http-proxy-middleware')

const serverConfig = require('../../build/webpack.config.server')

const Module = module.constructor
const mfs = new MemoryFs()
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs
let serverBundle
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.log(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()
  m._compile(bundle, 'server-entry.js')
  serverBundle = m.exports.default
})

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://0.0.0.0:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}
module.exports = function (app) {
  // app.use(async (ctx,next) => {
  //     if(ctx.request.path === '/public'){
  //        proxy('http://0.0.0.0', {
  //            port: 8888
  //        })
  //     }
  //     next()
  // })
  // app.use(async ctx => {
  //   const template =  await axios.get('http://0.0.0.0:8888/public/index.html')
  //   console.log(template)
  //   const content = ReactDomServer.renderToString(serverBundle)
  //   ctx.body = template.replace('<!-- app -->', content)
  // })
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!-- app -->', content))
    })
  })
}
