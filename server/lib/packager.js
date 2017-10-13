// Handles compressed message packages
const fs = require('fs')
const mongoose = require('mongoose')
const hasher = require('object-hash')
const knox = require('knox')
const { Buffer } = require('buffer')
const LZUTF8 = require('lzutf8')
const { eachSeries, series } = require('async')

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

const s3conf = new S3Config({
  'accessKeyId': AWS_ID,
  'secretAccessKey': AWS_KEY,
  'region': AWS_REGION,
  'bucket': AWS_BUCKET
})

const s3client = knox.createClient({
  key: AWS_ID,
  secret: AWS_KEY,
  bucket: AWS_BUCKET
})

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
      const hash = hasher(mess)
      const {
        threadId,
        receiverName,
        receiverPhone,
        senderName,
        senderPhone,
        content
      } = mess
      // Queue notifications
      notifier.queue(mess)
      // Upsert sub documents
      Thread.findOneAndUpdate(
        {
          threadId,
          'messages.hash': {
            $not: new RegExp(hash)
          }
        },
        {
          threadId,
          senderPhone,
          receiverPhone,
          '$addToSet': {
            messages: {
              hash,
              senderName,
              receiverName,
              content
            }
          }
        }, { upsert: true }, next)
    }, (err) => {
      callback(err)
      if (err) return
      // Don't notify when offgrid
      if (NODE_ENV !== 'offgrid') {
        notifier.process()
      }
    })
  },
  download (callback) {
    const key = getPackageKey()
    s3client.getFile(key, callback)
  }
}

module.exports = Packager
