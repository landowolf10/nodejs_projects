const Cloud = require('@google-cloud/storage')
const path = require('path')

const serviceKey = path.join(__dirname, '/prueba-382c1-4b0adc10fd00.json')

const { Storage } = Cloud

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'prueba-382c1',
})

module.exports = storage
