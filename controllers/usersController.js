const bcrypt = require('bcryptjs'),
  User = require('../models/user.js'),
  jwt = require('jsonwebtoken'),
  { success, error } = require('../helpers/response.js'),
  mailer = require('../middlewares/mailer.js'),
  fs = require('fs'),
  Imagekit = require('imagekit'),
  Auth = require('../events/auth.js')

var registrationHTML = fs.readFileSync(__dirname + '/../mailers/registration.html', {
  encoding: 'utf-8'
})

const imagekitInstance = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: `https://ik.imagekit.io/${process.env.IMAGEKIT_ID}`
})

function create(req, res) {
  req.body.encrypted_password = bcrypt.hashSync(req.body.password, 10);
  
  let user;

  User.create(req.body)
    .then((data) => {
      let user = data
      let token = jwt.sign({ _id: data._id }, process.env.JWT_SIGNATURE_KEY)

      registrationHTML = registrationHTML.replace('{user.name}', data.email)
      registrationHTML = registrationHTML.replace('{VerificationURL}', `${process.env.BASE_URL}/api/v1/users/verify/${token}`)

      return mailer.send({
        from: 'no-reply@express.com',
        to: data.email,
        subject: 'Email Verification',
        html: registrationHTML     
      })
    })
    .then(() => {
      success(res, 'Successfully registered', 200) 
    })
    .catch((err) => {
      error(res, err, 422)
    });
}

function login(req, res) {
  User.findOne({ email: req.body.email })
    .then((data) => {
      if (!data) {
        return error(res, "Email doesn't exist", 422)
      }

      let userLog = process.log.users[data._id]
      let loginCount = 0
      if (userLog)
        loginCount = userLog.count

      if (loginCount > 4) return error(res, "Try again later", 422)

      let isPasswordValid = bcrypt.compareSync(req.body.password, data.encrypted_password);

      if (!isPasswordValid) {
        Auth.emit('unauthorized', {
          _id: data._id,
          email: data.email,
          source: req.headers['user-agent']
        })
        return error(res, "Wrong password", 401) 
      }

      let token = jwt.sign({ _id: data._id }, process.env.JWT_SIGNATURE_KEY);

      success(res, {
        _id: data._id,
        email: data.email,
        token
      }, 200)
    })
    .catch((err) => {
      error(res, err, 422)
    });
}

function uploadPhoto(req, res) {
  imagekitInstance.upload({
    file: req.file.buffer.toString('base64'),
    fileName: `IMG-${Date.now()}`
  })
    .then(data => {
      return User.findByIdAndUpdate(req.user._id, {
        image: data.url
      })
    })
    .then(data => {
      res.status(200).json({
        status: true,
        data
      }) 
    })
    .catch(err => {
      res.status(422).json({
        status: false,
        errors: err
      }) 
    })
}

module.exports = {
  create,
  login,
  uploadPhoto
};
