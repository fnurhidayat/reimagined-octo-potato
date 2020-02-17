const axios = require('axios')

exports.getFacebook = (req, res) => {
  axios.get('https://www.facebook.com')
    .then(response => {
      res.status(200).send(response.data)
    })
    .catch(err => {
      res.status(422).send(err.response.data) 
    })
}

exports.getTodos = (req, res) => {
  axios.get('https://jsonplaceholder.typicode.com/todos')
    .then(response => {
      res.status(200).json({
        status: true,
        data: response.data.filter(i => i.completed)
      })
    })
}

exports.postTodos = (req, res) => {
  axios('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    data: JSON.stringify({
      title: req.body.title,
      body: req.body.body,
      userId: req.body.userId
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => {
      res.status(200).json({
        status: true,
        data: response.data
      })
    })
}

exports.sendMessage = (req, res) => {
  axios('https://api.telegram.org/bot1012067456:AAHEijJ2dLkVAgzcspLyzLDu2T-sipAFuVA/sendMessage', {
    method: 'POST',
    data: JSON.stringify({
      chat_id: '591162822',
      text: req.body.message
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    } 
  })
    .then(response => {
      res.status(200).json({
        status: true,
        data: response.data
      })
    })
    .catch(err => {
      res.status(422).json(err.response.data) 
    })
}
