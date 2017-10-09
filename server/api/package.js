const mongoose = require('mongoose')
const express = require('express')
const router = new express.Router()
const Packager = require('../lib/packager')
const { resWithError } = require('../utils')

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

// router
//   .route('/')
//   .post(
//     (req, res, next) => {
//       const data = Buffer.from(req.body.blob, 'base64')
//       const set = data.toString().split('\n')
//       set.splice(-1, 1)
//       set.forEach(piece => {
//         const uncompressed = LZUTF8.decompress(piece, {
//           inputEncoding: 'Base64',
//           outputencoding: 'String'
//         })
//         console.log(JSON.parse(uncompressed))
//       })
//       res.send('OK')
//     }
//   )

module.exports = router
