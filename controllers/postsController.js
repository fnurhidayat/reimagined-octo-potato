const Post = require('../models/post.js');

const create = (req, res) => {
  const { title, body } = req.body;
  const author = req.headers.authorization;

  const post = new Post({
    author, title, body,
  });

  post.save()
    .then(() => {
      res.status(201).json({
        status: true,
        data: post,
      });
    })
    .catch((err) => {
      res.status(422).json({
        status: false,
        errors: err,
      });
    });
};

function read(req, res) {
  Post.find()
    .populate({
      path: 'author',
      select: '-password',
    })
    .then((data) => {
      res.status(200).json({
        status: true,
        data,
      });
    })
    .catch((err) => {
      res.status(422).json({
        status: true,
        errors: err,
      });
    });
}

function like(req, res) {
  Post.findById(req.params.id)
    .then((data) => {
      if (data.likes.indexOf(req.headers.authorization) > -1) {
        return res.status(400).json({
          status: false,
          errors: 'You\'ve already liked this post',
        });
      }

      data.likes.push(req.headers.authorization);

      data.save()
        .then(() => {
          res.status(200).json({
            status: true,
            data,
          });
        })
        .catch((err) => {
          res.status(422).json({
            status: false,
            errors: err,
          });
        });

      return data;
    })
    .catch((err) => {
      res.status(400).json({
        status: false,
        errors: err,
      });
    });
}

module.exports = {
  create,
  read,
  like,
};
