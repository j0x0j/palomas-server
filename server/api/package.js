const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const router = new express.Router()
const Packager = require('../lib/packager')
const { resWithError } = require('../utils')

router.use(cors())

router
  .route('/')
  .post(
    (req, res, next) => {
      const { blob } = req.body
      if (!blob) {
        return resWithError(res, 400, 'Invalid parameters')
      }
      const messages = Packager.unpack(blob.toString('base64'))
      Packager.save(messages, (err) => {
        if (err) {
          return res.status(400).json({
            status: 'error',
            message: err.message
          })
        }
        res.json({ status: 'OK' })
      })
    }
  )

module.exports = router
