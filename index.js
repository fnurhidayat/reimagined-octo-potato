const express = require('express');

const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

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

app.use(express.json());
app.use(cors());
app.use(express.static('public'))

// istanbul ignore if
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    data: 'Hello World',
  });
});

const router = require('./router.js');

app.use('/api/v1', router);

module.exports = app;
