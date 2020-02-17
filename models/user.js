const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema({
  image: {
    type: 'string'
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
  },
  encrypted_password: {
    type: 'string',
    required: true,
  },
  is_confirmed: {
    type: 'boolean',
    default: false
  }
});

const User = mongoose.model('User', usersSchema);

module.exports = User;
