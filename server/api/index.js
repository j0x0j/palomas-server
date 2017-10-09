const mongoose = require('mongoose')
const path = require('path')
const constants = require('../config/constants')

// Controllers
const thread = require('./thread')
const package = require('./package')

module.exports = (server) => {
  // Health check
  server.get('/health', (req, res) => { res.json({ status: 'OK' }) })

  server.use('/thread', thread)
  server.use('/package', package)

  server.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../../public/index.html'))
  })
}
