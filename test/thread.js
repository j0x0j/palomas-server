/* Bootstrap Server */
const server = require('../index')

const mongoose = require('mongoose')
const should = require('should')
const request = require('request-promise')

const API_URL = 'http://localhost:8080'

const Thread = mongoose.model('Thread')

describe('Thread', function () {
  const threadId = 'i34tbir3534r'

  before(async function () {
    await Thread.create({
      threadId,
      receiverName: 'Juan Pérez',
      receiverPhone: '7877773322'
    })
  })

  after(async function () {
    await Thread.remove()
  })

  describe('#list()', function () {
    before(async function () {
      await Thread.create({
        threadId: 'bo34t08q4rfes4q',
        receiverName: 'Julia Santos',
        receiverPhone: '7879239920',
        messages: [
          {
            senderName: 'Maria Cintrón',
            senderPhone: '7871234002',
            content: 'Desde el centro comunitario'
          }
        ]
      })
      await Thread.create({
        threadId: 'b320rgb283rbve',
        receiverName: 'Julia Santos',
        receiverPhone: '7879239920',
        mesages: [
          {
            senderName: 'Gloria Alegría',
            senderPhone: '7874934894',
            content: 'Hoy llegaron ayudas del gobierno'
          }
        ]
      })
      await Thread.create({
        threadId: 'asdcdfv90udsfv89sfh',
        receiverName: 'Julia Santos',
        receiverPhone: '7879239920',
        mesages: [
          {
            senderName: 'Juan Ventura',
            senderPhone: '7879928333',
            content: 'Que bueno que logro enviar un mensaje'
          }
        ]
      })
    })

    it('should respond with error object for invalid properties', async function () {
      const options = {
        method: 'GET',
        uri: `${API_URL}/thread/list/877234234`,
        body: {
          content: ''
        },
        resolveWithFullResponse: true,
        json: true
      }
      try {
        await request(options)
      } catch (e) {
        const body = e.response.body
        e.response.statusCode.should.eql(404)
        body.should.be.a.Object
        body.should.have.property('status', 'error')
        body.should.have.property('message', 'Invalid parameters')
      }
    })

    it('should respond with an array of threads', async function () {
      const options = {
        method: 'GET',
        uri: `${API_URL}/thread/list/7879239920`,
        resolveWithFullResponse: true,
        json: true
      }
      const res = await request(options)
      const body = res.body
      res.statusCode.should.eql(200)
      body.should.be.a.Array
      body.length.should.be.above(2)
      body[0].messages[0].senderName.should.eql('Maria Cintrón')
    })
  })

  describe('Message', function () {
    describe('#create()', function () {
      it('should respond with error object for invalid properties', async function () {
        const options = {
          method: 'POST',
          uri: `${API_URL}/thread/message`,
          body: {
            content: ''
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

      it('should respond with error object for missing threadId', async function () {
        const options = {
          method: 'POST',
          uri: `${API_URL}/thread/message`,
          body: {
            threadId: '24t53grf0wdfbvs'
          },
          resolveWithFullResponse: true,
          json: true
        }
        try {
          await request(options)
        } catch (e) {
          const body = e.response.body
          e.response.statusCode.should.eql(404)
          body.should.be.a.Object
          body.should.have.property('status', 'error')
          body.should.have.property('message', 'No thread found')
        }
      })

      it('should respond with new thread and one message', async function () {
        const options = {
          method: 'POST',
          uri: `${API_URL}/thread/message`,
          body: {
            threadId,
            senderName: 'Maria Cintrón',
            senderPhone: '7871234002',
            content: 'Esto es contenido del mensaje'
          },
          resolveWithFullResponse: true,
          json: true
        }
        const res = await request(options)
        res.body.should.be.a.Object
        res.body.should.have.property('threadId', threadId)
        res.body.should.have.property('messages')
        res.body.messages.should.be.a.Array
      })
    })
    describe('#list()', function () {
      const anotherThreadId = 'skjdfblkajsbdf'

      before(async function () {
        await Thread.create({
          threadId: anotherThreadId,
          receiverName: 'Juan Pérez',
          receiverPhone: '7877773322',
          messages: [
            {
              senderName: 'Maria Cintrón',
              senderPhone: '7871234002',
              content: 'Esto es contenido del mensaje'
            },
            {
              senderName: 'Maria Cintrón',
              senderPhone: '7871234002',
              content: 'Aquí otra comunicación'
            }
          ]
        })
      })

      it('should respond with error object for missing thread', async function () {
        const options = {
          method: 'GET',
          uri: `${API_URL}/thread/message/list/2094u593w4h359w`,
          resolveWithFullResponse: true,
          json: true
        }
        try {
          await request(options)
        } catch (e) {
          const body = e.response.body
          e.response.statusCode.should.eql(404)
          body.should.be.a.Object
          body.should.have.property('status', 'error')
          body.should.have.property('message', 'No thread found')
        }
      })

      it('should respond with an array of messages', async function () {
        const options = {
          method: 'GET',
          uri: `${API_URL}/thread/message/list/${anotherThreadId}`,
          resolveWithFullResponse: true,
          json: true
        }
        const res = await request(options)
        const body = res.body
        res.statusCode.should.eql(200)
        body.should.be.a.Object
        body.should.have.property('threadId')
        body.should.have.property('receiverName')
        body.should.have.property('receiverPhone')
        body.messages.length.should.be.above(1)
        body.messages[0].senderName.should.eql('Maria Cintrón')
      })
    })
  })
})
