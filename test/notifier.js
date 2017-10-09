const should = require('should')
const Notifier = require('../server/lib/notifier')

const notifier = new Notifier()

describe('Notifier', function () {
  const sampleMessage = {
    threadId: '345cx923h4t9',
    receiverPhone: '7872220101',
    receiverName: 'Juan Cruz',
    senderName: 'Raul Gonzalez'
  }
  const sampleMessage2 = {
    threadId: 'i34hu0523i08uf',
    receiverPhone: '7879992020',
    receiverName: 'Romero Quevedo',
    senderName: 'Pascual Blanco'
  }

  describe('#queu()', function () {
    it('should be a function', function () {
      const type = typeof notifier.queue
      type.should.eql('function')
    })

    it('should queue a message and return "OK"', function () {
      const queued = notifier.queue(sampleMessage)
      queued.should.be.a.String
      queued.should.eql('OK')
    })

    it('should return "duplicate" for duplicate message', function () {
      const queued = notifier.queue(sampleMessage)
      queued.should.be.a.String
      queued.should.eql('duplicate')
    })
  })

  describe('#flush()', function () {
    it('should be a function', function () {
      const type = typeof notifier.flush
      type.should.eql('function')
    })

    it('should return an array of messages', function () {
      const messages = notifier.flush()
      messages.should.be.a.Array
      messages[0].should.have.property('threadId')
      notifier.receivers.should.have.property('length', 0)
      notifier.uniques.should.have.property('length', 0)
    })
  })

  describe('#process()', function () {
    it('should be a function', function () {
      const type = typeof notifier.process
      type.should.eql('function')
    })

    it('should send messages and callback with no error', function (done) {
      notifier.queue(sampleMessage)
      notifier.queue(sampleMessage2)
      notifier.process(done)
    })
  })

  describe('#buildMessage()', function () {
    it('should be a function', function () {
      const type = typeof notifier.buildMessage
      type.should.eql('function')
    })

    it('should return a formatted message', function () {
      const message = notifier.buildMessage(sampleMessage)
      message.should.be.a.String
    })
  })
})
