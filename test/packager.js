const should = require('should')
const fs = require('fs')
const mongoose = require('mongoose')
const Packager = require('../server/lib/packager')
const { createPackage } = require('./helper')

const Thread = mongoose.model('Thread')

describe('Packager', function () {
  const dataFile = __dirname + '/data/messages.json.lz'

  before(function (done) {
    createPackage(dataFile, done)
  })

  after(function (done) {
    fs.unlink(dataFile, (err) => { done() })
  })

  describe('#unpack()', function () {
    it('should be a function', function () {
      const type = typeof Packager.unpack
      type.should.eql('function')
    })

    it('should return an error for missing blob', function () {
      const messages = Packager.unpack('')
      messages.should.be.a.Error
      messages.should.have.property('message', 'No blob provided')
    })

    it('should return a collection of messages provided a valid package', function () {
      const blob = fs.readFileSync(dataFile)
      const messages = Packager.unpack(blob.toString('base64'))
      messages.should.be.a.Array
      messages.should.have.property('length', 2)
      messages[0].should.have.property('threadId', '8439ywrbf4brg5werfv')
    })
  })

  describe('#pack()', function () {
    it('should be a function', function () {
      const type = typeof Packager.pack
      type.should.eql('function')
    })

    it('should return an error for missing string', function () {
      const compressed = Packager.pack('')
      compressed.should.be.a.Error
      compressed.should.have.property('message', 'No string provided')
    })

    it('should return a compressed string', function () {
      const message = Packager.pack(JSON.stringify({ some: 'var' }))
      message.should.be.a.String
    })
  })

  describe('#save()', function () {
    after(async () => {
      await Thread.remove()
    })

    it('should be a function', function () {
      const type = typeof Packager.save
      type.should.eql('function')
    })

    it('should return an error for missing messages', function (done) {
      Packager.save(null, err => {
        err.should.be.a.Error
        err.should.have.property('message', 'No messages provided')
        done()
      })
    })

    it('should callback with no error', function (done) {
      const blob = fs.readFileSync(dataFile)
      const messages = Packager.unpack(blob.toString('base64'))
      Packager.save(messages, done)
    })
  })
})
