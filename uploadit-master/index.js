const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const https = require('https')
const fs = require('fs');

const uploadImage = require('./helpers/helpers')

const app = express()

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
});

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/uploads', async (req, res, next) => {
  try {
    const myFile = req.file
    const imageUrl = await uploadImage(myFile)

    res
      .status(200)
      .json({
        message: "Upload was successful",
        data: imageUrl
      })
  } catch (error) {
    next(error)
  }
})

/*app.get('/downloadLog', function (req, res, next) {
  var file = fs.createWriteStream("20130211-QA-INF-V2-PLAN_DE_PRUEBAS.pdf");

  var request = http.get("https://storage.cloud.google.com/prueba_tortoise/20130211-QA-INF-V2-PLAN_DE_PRUEBAS.pdf", function(response) {
    response.pipe(file);
  });    
})*/

app.get('/downloadLog',(req, res) => {
  const url = 'https://storage.cloud.google.com/prueba_tortoise/20130211-QA-INF-V2-PLAN_DE_PRUEBAS.pdf'
  
  https.get(url, resp => resp.pipe(fs.createWriteStream(`./test.jpeg`)));
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})

app.listen(9001, () => {
  console.log('app now listening for requests!!!')
})

