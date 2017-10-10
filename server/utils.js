const crypto = require('crypto')
const Buffer = require('buffer').Buffer
const reverse = require('buffer-reverse')

const utils = {}

utils.resWithError = (res, status, message) => {
  res.status(status).json({
    status: 'error',
    message
  })
}

utils.genThreadId = (to, from) => {
  const hash = crypto.createHash('md5')
  hash.update(to + from)
  const result = Buffer.from(hash.digest('hex'), 'hex')
  const flipped = reverse(result)
  return flipped.toString('hex')
}

module.exports = utils
