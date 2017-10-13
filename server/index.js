const express = require('express')

module.exports = (env) => {
  const server = express()

  require('./config/server')(env, server)
  require('./api')(env, server)

  const instance = server.listen(server.get('port'), () => {
    console.log(`💻  Server listening on port ${instance.address().port}\n`)
  })

  return instance
}
