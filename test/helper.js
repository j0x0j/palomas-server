const fs = require('fs')
const Packager = require('../server/lib/packager')

const helper = () => {
  function createPackage (file, done) {
    const mess1 = JSON.stringify({
      threadId: '8439ywrbf4brg5werfv',
      senderName: 'Juan Perez',
      senderPhone: '7872220031',
      receiverName: 'Gloria Cruz',
      receiverPhone: '7872260029',
      content: 'Contenido para el primer mensaje'
    })
    const mess2 = JSON.stringify({
      threadId: '09w48y508fvce89bf',
      senderName: 'Cobalto Rivera',
      senderPhone: '7872220032',
      receiverName: 'Camila Ortíz',
      receiverPhone: '7872203939',
      content: 'Este es el segundo mensaje'
    })
    Packager.pack(mess1, file, (err) => {
      Packager.pack(mess2, file, (err2) => {
        done()
      })
    })
  }

  return { createPackage }
}

module.exports = helper()
