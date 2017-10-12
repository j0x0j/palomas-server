const mongoose = require('mongoose')
const path = require('path')
const constants = require('../config/constants')

// Controllers
const thread = require('./thread')
const package = require('./package')

module.exports = (server) => {
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

  server.get('/*', (req, res) => {
    // 404 for data directory
    if (/data/.test(req.url)) {
      return res.status(404).send()
    }
    res.sendFile(path.join(__dirname, '/../../public/index.html'))
  })
}
