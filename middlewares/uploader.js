const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  
  filename: (req, file, cb) => {
    let ext = file.mimetype.split("/")[1]
    let filename = 'IMG'+ '-' + Date.now() + '.' + ext
    cb(null, filename)
  }
})

const upload = multer()

module.exports = upload.single('image')
