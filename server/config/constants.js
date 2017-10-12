const env = process.env.NODE_ENV

module.exports = {
  TWILIO_SID: (env === 'testing' ? process.env.TWILIO_SID_TEST : process.env.TWILIO_SID),
  TWILIO_TOK: (env === 'testing' ? process.env.TWILIO_TOK_TEST : process.env.TWILIO_TOK),
  TWILIO_NUM: (env === 'testing' ? process.env.TWILIO_TEST_FROM_NUMBER : '17873053701'),
}
