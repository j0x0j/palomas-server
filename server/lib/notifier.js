// Handles notifications queue
const { eachSeries } = require('async')

class Notifier {
  constructor () {
    this.receivers = []
    this.uniques = []
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
    // @TODO: Send twilio SMS
    setTimeout(function () {
      callback()
    }, 100)
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
    return (
      `Hola ${receiverName}, ${senderName} te ha enviado un mensaje. ` +
      `Puedes leerlo tocando este enlace. https://palom.as/thread?id=${threadId}`
    )
  }
}

module.exports = Notifier
