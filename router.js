const express = require('express');
const multer = require('multer')

const router = express.Router();

const authenticate = require('./middlewares/authenticate.js');
const uploader = require('./middlewares/uploader.js')

const post = require('./controllers/postsController.js');
const user = require('./controllers/usersController.js');

router.post('/posts', authenticate, post.create);
router.get('/posts', authenticate, post.read);
router.post('/posts/:id/like', authenticate, post.like);

// User Resources
router.post('/auth/register', user.create);
router.post('/auth/login', user.login);
router.post('/auth/uploadPhoto', authenticate, uploader, user.uploadPhoto)
router.post('/auth/registerForm', user.registerForm)

module.exports = router;
