const mongoose = require('mongoose')
const express = require('express')
const { join } = require('path')
const hasher = require('object-hash')
const router = new express.Router()
const Packager = require('../lib/packager')
const { resWithError, genThreadId } = require('../utils')

const Thread = mongoose.model('Thread')
const PACKAGE_PATH = join(__dirname, '/../../public/data/messages.json.lz')

router
  .route('/list/:phone')
  .get(
    async (req, res, next) => {
      const { phone } = req.params
      if (!phone) {
        return resWithError(res, 400, 'Invalid parameters')
      }
      try {
        const threads =
          await Thread.find({ $or: [{ 'senderPhone': phone }, { 'receiverPhone': phone }] })
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
          senderPhone,
          receiverPhone,
          messages
        } = thread
        res.json({
          threadId,
          senderPhone,
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
      const {
        threadId,
        senderName,
        receiverName,
        content
      } = req.body
      if (!threadId) {
        return resWithError(res, 400, 'Invalid parameters')
      }

      const thread = await Thread.findOne({ threadId })
      if (!thread) {
        return resWithError(res, 404, 'No thread found')
      }

      const { senderPhone, receiverPhone } = thread
      const hash = hasher({
        threadId,
        receiverPhone,
        receiverName,
        senderPhone,
        senderName,
        content
      })

      // Push message to thread
      thread.messages.push({
        hash,
        senderName,
        receiverName,
        content
      })
      await thread.save()

      Packager.pack(JSON.stringify({
        threadId,
        receiverName,
        receiverPhone,
        senderName,
        senderPhone,
        content
      }), PACKAGE_PATH, (err) => {
        if (err) console.log(err)
        res.json(thread)
      })
    }
  )

router
  .route('/')
  .post(
    async (req, res, next) => {
      // Check if is in 'offgrid' mode
      if (
        process.env.NODE_ENV !== 'offgrid' &&
        process.env.NODE_ENV !== 'testing'
      ) {
        return resWithError(res, 418, 'Not available')
      }
      const {
        receiverName,
        receiverPhone,
        senderName,
        senderPhone,
        content
      } = req.body
      if (
        !receiverPhone ||
        !receiverName ||
        !senderName ||
        !senderPhone ||
        !content
      ) {
        return resWithError(res, 400, 'Invalid parameters')
      }
      if (req.body.threadId) {
        // This is not a new thread
        return resWithError(res, 400, 'Not a new thread')
      }
      const threadId = genThreadId(receiverPhone, senderPhone)
      const hash = hasher({
        threadId,
        receiverPhone,
        receiverName,
        senderPhone,
        senderName,
        content
      })
      const data = {
        threadId,
        senderPhone,
        receiverPhone,
        messages: [
          {
            hash,
            senderName,
            receiverName,
            content
          }
        ]
      }
      try {
        const thread = await Thread.create(data)
        // Pack and append message
        Packager.pack(JSON.stringify({
          threadId,
          receiverName,
          receiverPhone,
          senderName,
          senderPhone,
          content
        }), PACKAGE_PATH, (err) => {
          if (err) console.log(err)
          res.json(thread)
        })
      } catch (e) {
        resWithError(res, 400, e.message)
      }
    }
  )

module.exports = router
