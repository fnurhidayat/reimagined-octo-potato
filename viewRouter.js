const router = require('express').Router(),
      viewController = require('./controllers/viewController.js')

router.get('/register', viewController.register)

module.exports = router
