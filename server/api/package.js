const mongoose = require('mongoose')
const express = require('express')
const router = new express.Router()
const Packager = require('../lib/packager')
const { resWithError } = require('../utils')
const { AP_ID } = process.env

router
  .route('/')
  .post(
    (req, res, next) => {
      const { blob, key } = req.body
      if (!blob) {
        return resWithError(res, 400, 'Invalid parameters')
      }
      if (!key || key.split('-')[1] === AP_ID) {
        return resWithError(res, 400, 'No upload to same AP')
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
