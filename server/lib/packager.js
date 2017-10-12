// Handles compressed message packages
const fs = require('fs')
const mongoose = require('mongoose')
const hasher = require('object-hash')
const { Buffer } = require('buffer')
const LZUTF8 = require('lzutf8')
const { eachSeries } = require('async')
const Notifier = require('./notifier')

const Thread = mongoose.model('Thread')

const Packager = {
  pack: (str, file) => {
    if (!str || typeof str !== 'string') {
      return new Error('No string provided')
    }

    const packed = LZUTF8.compress(str, { outputEncoding: 'Base64' })
    if (file) {
      fs.appendFileSync(file, packed + '\n')
    }
    return packed
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
      notifier.process()
    })
  }
}

module.exports = Packager
