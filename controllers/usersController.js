const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const {
  success,
  error
} = require('../helpers/response.js')

function create(req, res) {
  req.body.encrypted_password = bcrypt.hashSync(req.body.password, 10);

  User.create(req.body)
    .then((data) => {
      success(res, data, 200)
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

      let isPasswordValid = bcrypt.compareSync(req.body.password, data.encrypted_password);

      if (!isPasswordValid) return error(res, "Wrong password", 401) 

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

module.exports = {
  create,
  login
};
