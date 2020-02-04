const express = require('express');

const router = express.Router();

const authenticate = require('./middlewares/authenticate.js');

const post = require('./controllers/postsController.js');
const user = require('./controllers/usersController.js');

router.post('/posts', post.create);
router.get('/posts', authenticate, post.read);
router.post('/posts/:id/like', post.like);

// User Resources
router.post('/users', user.create);
router.post('/auth/login', user.login);

module.exports = router;