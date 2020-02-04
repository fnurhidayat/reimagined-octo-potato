const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema({
  email: {
    type: 'string',
    required: true,
    unique: true,
  },
  encrypted_password: {
    type: 'string',
    required: true,
  },
});

const User = mongoose.model('User', usersSchema);

module.exports = User;
