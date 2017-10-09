// Handles compressed message packages
const mongoose = require('mongoose')
const Buffer = require('buffer').Buffer
const LZUTF8 = require('lzutf8')
const { eachSeries } = require('async')
const Notifier = require('./notifier')

const Thread = mongoose.model('Thread')

const Packager = {
  pack: (str) => {
    if (!str || typeof str !== 'string') {
      return new Error('No string provided')
    }

    return LZUTF8.compress(str, { outputEncoding: 'Base64' })
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
        { threadId },
        {
          threadId,
          receiverName,
          receiverPhone,
          '$addToSet': {
            messages: {
              senderName,
              senderPhone,
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
