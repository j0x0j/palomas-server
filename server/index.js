const express = require('express')

module.exports = (env, db) => {
  const server = express()

  require('./config/server')(env, server)
  require('./api')(server, db)

  const instance = server.listen(server.get('port'), () => {
    console.log(`💻  Server listening on port ${instance.address().port}`)
  })
}
