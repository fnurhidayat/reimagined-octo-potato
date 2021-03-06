const express = require('express');
const swagger = require('swagger-ui-express')
const documentation = require('./swagger.json')

const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
process.log = {}

// istanbul ignore next
const env = process.env.NODE_ENV || 'development';

const dbConnectionString = {
  development: process.env.DB_CONNECTION,
  test: process.env.DB_CONNECTION_TEST,
  staging: process.env.DB_CONNECTION_STAGING,
  production: process.env.DB_CONNECTION_PRODUCTION,
};

const mongoose = require('mongoose');

mongoose.connect(dbConnectionString[env], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => {
    console.log('  Database connected!')
  })
  // istanbul ignore next
  .catch((err) => {
    // istanbul ignore next
    process.exit()
  });

const morgan = require('morgan');
const router = require('./router.js');
const viewRouter = require('./viewRouter.js')

app.set('view engine', 'pug')
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors());
app.use(express.static('public'))
app.use('/kitab', swagger.serve, swagger.setup(documentation))

// istanbul ignore if
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use('/api/v1', router)
app.use('/', viewRouter)
app.get('/', (req, res) => {
  res.render('index')
});

module.exports = app;
