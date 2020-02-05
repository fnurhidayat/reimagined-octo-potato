const chai = require('chai');

const {
  expect,
  should,
} = chai;

const http = require('chai-http');

chai.use(http);

const bcrypt = require('bcryptjs');
const app = require('../index.js');
const User = require('../models/user.js');

describe('User Collection', function() {

  before(function() {
    let user = {
      name: 'Fikri',
      email: 'test01@mail.com',
      password: '123456'
    }

    user.encrypted_password = bcrypt.hashSync(user.password, 10);
    return User.create(user)
  });

  after(function() {
    User.deleteMany({}).then(() => done())
  });

  context('Auth Register', function() {

    it('Should create new user', function(done) {
      const user = {
        name: 'Fikri',
        email: 'test02@mail.com',
        password: '123456',
      };

      chai.request(app)
        .post('/api/v1/users')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(user))
        .end((err, res) => {
          expect(res.status).to.eq(200);
          done()
        });
    });

    it('Should not new user', function(done) {
      const user = {
        name: 'Fikri',
        email: 'test01@mail.com',
        password: '123456',
      };

      chai.request(app)
        .post('/api/v1/users')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(user))
        .end((err, res) => {
          expect(res.status).to.eq(422);
          done()
        });
    });
  });


  context('Auth Login', function() {

    it('Should successfully logged in', function(done) {
      const user = {
        name: 'Fikri',
        email: 'test01@mail.com',
        password: '123456',
      };

      chai.request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(user))
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.data.token).to.be.a('string');
          done()
        });
    });

    it('Should not successfully logged in', function(done) {
      let user = {
        name: 'Fikri',
        email: 'test01@mail.com',
        password: '123456',
      };
      user.password = '1234567';

      chai.request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(user))
        .end((err, res) => {
          expect(res.status).to.eq(401);
          expect(res.body.errors).to.be.a('string');
          done()
        });
    });

    it('Should not successfully logged in because email doesn\'t exist!', function(done) {
      let user = {
        name: 'Fikri',
        email: 'test01@mail.com',
        password: '123456',
      };

      user.email = 'abc@mail.com';

      chai.request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(user))
        .end((err, res) => {
          expect(res.status).to.eq(422);
          expect(res.body.errors).to.be.a('string'); 
          done()
        });
    });
  });
});
