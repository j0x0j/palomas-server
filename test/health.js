/* Bootstrap Server */
const server = require('../index')

const should = require('should')
const request = require('request-promise')

const API_URL = 'http://localhost:8080'

describe('Health', function () {
  it('should return object with status "OK"', async function () {
    const res = await request(`${API_URL}/health`, { resolveWithFullResponse: true })
    const body = JSON.parse(res.body)
    res.statusCode.should.eql(200)
    body.should.be.a.Object
    body.should.have.property('status', 'OK')
  })
})
