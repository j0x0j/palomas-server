const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const favicon = require('express-favicon')

module.exports = (env, server) => {
  server.set('port', process.env.PORT || 8080);

  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(bodyParser.json())
  server.use(cookieParser())
  server.use(express.static(path.join(__dirname, '/../../public')))
  server.use(favicon(__dirname + '/../../public/favicon.ico'))
}
