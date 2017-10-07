const constants = require('../config/constants')

module.exports = (server, db) => {
  // Health check
  server.get('/health', (req, res) => { res.send('OK') })
}
