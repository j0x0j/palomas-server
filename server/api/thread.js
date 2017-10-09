const mongoose = require('mongoose')
const express = require('express')
const router = new express.Router()
const { resWithError } = require('../utils')

const Thread = mongoose.model('Thread')

router
  .route('/list/:receiverPhone')
  .get(
    async (req, res, next) => {
      const { receiverPhone } = req.params
      if (!receiverPhone) {
        return resWithError(res, 400, 'Invalid parameters')
      }
      try {
        const threads =
          await Thread.find({ receiverPhone })
            .slice('messages', [0, 1])
        if (!threads) {
          return resWithError(res, 404, 'No threads found')
        }
        res.json(threads)
      } catch (e) {
        next(e)
      }
    }
  )

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
        const {
          receiverName,
          receiverPhone,
          messages
        } = thread
        res.json({
          threadId,
          receiverName,
          receiverPhone,
          messages
        })
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
