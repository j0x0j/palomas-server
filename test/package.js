/* Bootstrap Server */
const server = require('../index')

const fs = require('fs')
const mongoose = require('mongoose')
const should = require('should')
const request = require('request-promise')
const { createPackage } = require('./helper')

const API_URL = 'http://localhost:8080'

const Thread = mongoose.model('Thread')

describe('Package', function () {
  const dataFile = __dirname + '/data/messages.json.lz'

  let blob

  before(function (done) {
    createPackage(dataFile, done)
  })

  after(function (done) {
    fs.unlink(dataFile, (err) => { done() })
  })

  describe('#submit()', function () {
    before(function () {
      blob = fs.readFileSync(dataFile).toString('base64')
    })

    after(async () => {
      await Thread.remove()
    })

    it('should respond with error object for invalid properties', async function () {
      const options = {
        method: 'POST',
        uri: `${API_URL}/package`,
        body: {
          blob: ''
        },
        resolveWithFullResponse: true,
        json: true
      }
      try {
        await request(options)
      } catch (e) {
        const body = e.response.body
        e.response.statusCode.should.eql(400)
        body.should.be.a.Object
        body.should.have.property('status', 'error')
        body.should.have.property('message', 'Invalid parameters')
      }
    })

    it('should respond with status "OK"', async function () {
      const options = {
        method: 'POST',
        uri: `${API_URL}/package`,
        body: { blob, key: 'package-TEST' },
        resolveWithFullResponse: true,
        json: true
      }
      const res = await request(options)
      const body = res.body
      res.statusCode.should.eql(200)
      body.should.be.a.Object
      body.should.have.property('status', 'OK')
    })

    it('should respond with error object for same [AP] package', async function () {
      const options = {
        method: 'POST',
        uri: `${API_URL}/package`,
        body: { blob, key: 'package-000001' },
        resolveWithFullResponse: true,
        json: true
      }
      try {
        await request(options)
      } catch (e) {
        const body = e.response.body
        e.response.statusCode.should.eql(400)
        body.should.be.a.Object
        body.should.have.property('status', 'error')
        body.should.have.property('message', 'No upload to same AP')
      }
    })
  })
})
