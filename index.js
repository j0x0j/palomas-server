/*
 * Load env variables
 * if development
 *
 */
const env = process.env.NODE_ENV || 'development'
if (env === 'development') {
  require('dotenv').load()
}

/*
 * Load db and server
 *
 */
const fs = require('fs')
const join = require('path').join
const mongoose = require('mongoose')
const models = join(__dirname, '/server/models')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URL, {
  useMongoClient: true
})
mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
)

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)))

module.exports = require('./server')(env)
