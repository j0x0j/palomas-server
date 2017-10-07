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
 const mongoose = require('mongoose')

 mongoose.Promise = global.Promise
 mongoose.createConnection(process.env.MONGO_URL, {
   useMongoClient: true
 })
 .then(db => {
   require('./server')(env, db)
 })
 .catch(err => {
   console.log(err)
   process.exit(0)
 })
