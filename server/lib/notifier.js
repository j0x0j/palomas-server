// Handles notifications queue
const { eachSeries } = require('async')
const Twilio = require('twilio')
const latinize = require('latinize')
// extend for n tilde
latinize.characters['Ñ'] = 'N'
latinize.characters['ñ'] = 'n'

const { TWILIO_SID, TWILIO_TOK, TWILIO_NUM } = require('../config/constants')
const { NODE_ENV, TWILIO_TEST_TO_NUMBER } = process.env

class Notifier {
  constructor () {
    this.receivers = []
    this.uniques = []
    if (TWILIO_SID && TWILIO_TOK) {
      this.client = new Twilio(TWILIO_SID, TWILIO_TOK)
    }
  }

  queue (message) {
    const {
      threadId,
      receiverPhone,
      receiverName,
      senderName
    } = message
    if (this.uniques.indexOf(threadId) > -1) {
      return 'duplicate'
    } else {
      this.receivers.push({
        threadId,
        receiverPhone,
        receiverName,
        senderName
      })
      this.uniques.push(threadId)
    }
    return 'OK'
  }

  flush () {
    const receivers = this.receivers
    this.receivers = []
    this.uniques = []
    return receivers
  }

  notify (mess, callback) {
    let to, from = TWILIO_NUM
    const body = this.buildMessage(mess)
    if (NODE_ENV === 'testing') {
      to = TWILIO_TEST_TO_NUMBER
    } else {
      to = mess.receiverPhone
    }
    if (!this.client) {
      return callback(null)
    }
    this.client.messages.create({ body, to, from })
      .then(message => {
        callback(null, message.sid)
      })
      .catch(err => { callback(err) })
  }

  process (callback) {
    const self = this
    const messages = this.flush()
    eachSeries(messages, (mess, next) => {
      self.notify(mess, next)
    }, callback)
  }

  buildMessage (mess) {
    const { threadId, receiverName, senderName } = mess
    const name = latinize(senderName)
    return (
      `${name} te ha enviado un mensaje. https://palom.as/thread?id=${threadId}`
    )
  }
}

module.exports = Notifier
