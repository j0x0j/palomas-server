const mongoose = require('mongoose')
const constants = require('../config/constants')

// Controllers
const thread = require('./thread')

module.exports = (server) => {
  // Health check
  server.get('/health', (req, res) => { res.json({ status: 'OK' }) })

  server.use('/thread', thread)
}
