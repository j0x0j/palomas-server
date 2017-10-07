const fs = require('fs')
const join = require('path').join
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const favicon = require('express-favicon')

const models = join(__dirname, '../models')

module.exports = (env, server) => {
  server.set('port', env.PORT || 8080);

  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())
  server.use(cookieParser())
  server.use(express.static(path.join(__dirname, '/../../public')))
  server.use(favicon(__dirname + '/../../public/favicon.ico'))

  // Bootstrap models
  fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)))
}
