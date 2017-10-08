const mongoose = require('mongoose')
const express = require('express')
const router = new express.Router()

const Thread = mongoose.model('Thread')

const resWithError = (res, status, message) => {
  res.status(status).json({
    status: 'error',
    message
  })
}

router
  .route('/message/list/:threadId')
  .get(
    async (req, res, next) => {
      const { threadId } = req.params
      try {
        const thread = await Thread.findOne({ threadId })
        if (!thread) {
          return resWithError(res, 404, 'No thread found')
        }
        res.json(thread.messages)
      } catch (e) {
        next(e)
      }
    }
  )

router
  .route('/message')
  .post(
    async (req, res, next) => {
      const data = req.body
      const threadId = data.threadId
      if (!threadId) {
        return resWithError(res, 400, 'Invalid parameters')
      }

      const thread = await Thread.findOne({ threadId })
      if (!thread) {
        return resWithError(res, 404, 'No thread found')
      }
      // Push message to thread
      thread.messages.push(data)
      await thread.save()

      res.json(thread)
    }
  )

module.exports = router
