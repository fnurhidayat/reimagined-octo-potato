const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: 'string',
    required: true,
  },
  body: {
    type: 'string',
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
