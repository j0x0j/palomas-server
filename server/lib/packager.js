// Handles compressed message packages
const debug = require('debug')('packager')
const fs = require('fs')
const mongoose = require('mongoose')
const hasher = require('object-hash')
const knox = require('knox')
const { Buffer } = require('buffer')
const LZUTF8 = require('lzutf8')
const { eachSeries, series, waterfall } = require('async')

const Notifier = require('./notifier')
const {
  S3Config,
  S3Append,
  Format
} = require('s3-append')
const {
  NODE_ENV,
  AWS_ID,
  AWS_KEY,
  AWS_REGION,
  AWS_BUCKET
} = process.env

const Thread = mongoose.model('Thread')

const getPackageKey = () => NODE_ENV === 'testing' ? 'messages.json.lz.test' : 'messages.json.lz'

const Packager = {
  pack: (str, file, cb) => {
    if (!str || typeof str !== 'string') {
      return cb(new Error('No string provided'))
    }

    const packed = LZUTF8.compress(str, { outputEncoding: 'Base64' })

    series([
      (callback) => {
        // Write to file
        if (file && NODE_ENV !== 'production') {
          fs.appendFile(file, packed + '\n', callback)
        } else {
          callback(null)
        }
      },
      (callback) => {
        // Write to S3
        if (
          NODE_ENV === 'production' ||
          NODE_ENV === 'testing'
        ) {
          const s3conf = new S3Config({
            'accessKeyId': AWS_ID,
            'secretAccessKey': AWS_KEY,
            'region': AWS_REGION,
            'bucket': AWS_BUCKET
          })
          const key = getPackageKey()
          const service = new S3Append(s3conf, key, Format.Text)
          service.append(packed)
          service.flush()
            .then(callback)
            .catch(callback)
        } else {
          callback(null)
        }
      },
    ], (err) => {
      cb(err, packed)
    })
  },
  unpack: (blob) => {
    if (!blob || typeof blob !== 'string') {
      return new Error('No blob provided')
    }

    const data = Buffer.from(blob, 'base64')
    const set = data.toString().split('\n')
    // Remove the last item which is blank
    set.splice(-1, 1)

    const messages = set.map(piece => {
      const uncompressed = LZUTF8.decompress(piece, {
        inputEncoding: 'Base64',
        outputencoding: 'String'
      })
      return JSON.parse(uncompressed)
    })

    return messages
  },
  save: (messages, callback) => {
    if (
      !messages || typeof messages !== 'object' || messages.length < 1
    ) {
      return callback(new Error('No messages provided'))
    }

    const notifier = new Notifier()
    eachSeries(messages, (mess, next) => {
      debug('message', mess)
      const hash = hasher(mess)
      const {
        threadId,
        receiverName,
        receiverPhone,
        senderName,
        senderPhone,
        content
      } = mess
      let isnew = false
      waterfall([
        (cb) => {
          // Check if thread exists
          Thread.findOne({ threadId }, (err, doc) => {
            cb(err, doc)
          })
        },
        (res, cb) => {
          if (!res) {
            // thread is new
            debug('thread is new')
            const thread = new Thread({
              threadId,
              senderPhone,
              receiverPhone,
              messages: [{
                hash,
                senderName,
                receiverName,
                content
              }]
            })
            isnew = true
            // Queue notifications
            debug('will notify recipient')
            notifier.queue(mess)
            thread.save((err, doc) => {
              cb(err, doc)
            })
          } else {
            // check if hash exists in set
            debug('thread exists')
            Thread
              .findOne({
                threadId,
                'messages.hash': {
                  '$ne': hash
                }
              }, (err, doc) => {
                cb(err, doc)
              })
          }
        },
        (thread, cb) => {
          if (isnew || !thread) {
            // hash is already in set
            debug('message already exists')
            cb()
          } else {
            thread.messages.push({
              hash,
              senderName,
              receiverName,
              content
            })
            // Queue notifications
            debug('will notify recipient')
            notifier.queue(mess)
            thread.save((err, doc) => {
              cb(err, doc)
            })
          }
        },
      ], (err, final) => {
        // Don't notify when offgrid
        if (NODE_ENV !== 'offgrid') {
          debug('will send notifications')
          notifier.process()
        }
        next(err)
      })
    }, callback)
  },
  download (callback) {
    const s3client = knox.createClient({
      key: AWS_ID,
      secret: AWS_KEY,
      bucket: AWS_BUCKET
    })
    const key = getPackageKey()
    s3client.getFile(key, callback)
  }
}

module.exports = Packager
