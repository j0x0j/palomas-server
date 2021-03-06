const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Message Schema

const MessageSchema = new Schema({
  hash: {
    type: String,
    default: '',
    trim: true,
    index: { unique: true }
  },
  senderName: {
    type: String,
    default: '',
    trim: true
  },
  receiverName: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  location: {
    type: [Number],
    index: '2dsphere'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Thread Schema

const ThreadSchema = new Schema({
  threadId: {
    type: String,
    default: '',
    trim: true,
    index: true
  },
  receiverPhone: {
    type: String,
    default: '',
    trim: true,
    index: true
  },
  senderPhone: {
    type: String,
    default: '',
    trim: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  messages: [MessageSchema]
})

// Validations

// Pre-remove hook

// Methods

// Statics

mongoose.model('Thread', ThreadSchema)
