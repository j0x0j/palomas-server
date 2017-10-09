const utils = {}

utils.resWithError = (res, status, message) => {
  res.status(status).json({
    status: 'error',
    message
  })
}

module.exports = utils
