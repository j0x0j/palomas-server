const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Message Schema

const MessageSchema = new Schema({
  senderName: {
    type: String,
    default: '',
    trim: true
  },
  senderPhoneNumber: {
    type: Number,
    default: '',
    trim: true
  },
  body: {
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
  receiverName: {
    type: String,
    default: '',
    trim: true
  },
  receiverPhone: {
    type: Number,
    default: '',
    trim: true
  },
  messages: [MessageSchema]
})

// Validations

// Pre-remove hook

// Methods

// Statics

mongoose.model('Thread', ThreadSchema)
