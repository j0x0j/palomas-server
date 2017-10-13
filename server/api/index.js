const mongoose = require('mongoose')
const path = require('path')
const constants = require('../config/constants')
const Packager = require('../lib/packager')

// Controllers
const thread = require('./thread')
const package = require('./package')

module.exports = (env, server) => {
  // Health check
  server.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      env: process.env.NODE_ENV,
      apid: process.env.AP_ID
    })
  })

  server.use('/thread', thread)
  server.use('/package', package)

  if (
    env === 'production' ||
    env === 'testing'
  ) {
    // Server package from s3 rather than filesystem
    server.get('/data/messages.json.lz', (req, res) => {
      Packager.download((err, file) => { file.pipe(res) })
    })
  }

  server.get('/*', (req, res) => {
    // 404 for data directory
    if (/data/.test(req.url)) {
      return res.status(404).send()
    }
    res.sendFile(path.join(__dirname, '/../../public/index.html'))
  })
}
