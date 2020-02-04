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

describe('User Collection', () => {
  beforeEach((done) => {
    User.deleteMany({}).then(() => done())
  });

  after((done) => {
    User.deleteMany({}).then(() => done())
  });

  context('Auth Register', () => {
    it('Should create new user', () => {
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
          expect(res.status).to.eq(200);
        });
    });

    it('Should not new user', () => {
      const user = {
        name: 'Fikri',
        email: 'test01@mail.com',
        password: '123456',
      };

      user.encrypted_password = bcrypt.hashSync(user.password, 10);
      User.create(user).then((data) => {
        chai.request(app)
          .post('/api/v1/users')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(user))
          .end((err, res) => {
            expect(res.status).to.eq(422);
          });
      });
    });
  });


  context('Auth Login', () => {

    it('Should successfully logged in', (done) => {
      const user = {
        name: 'Fikri',
        email: 'test01@mail.com',
        password: '123456',
      };

      user.encrypted_password = bcrypt.hashSync(user.password, 10);
      let newUser = new User(user);

      newUser.save().then((data) => {
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
    });

    it('Should not successfully logged in', (done) => {
      const user = {
        name: 'Fikri',
        email: 'test01@mail.com',
        password: '123456',
      };

      user.encrypted_password = bcrypt.hashSync(user.password, 10);
      let newUser = new User(user);

      newUser.save().then((data) => {
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
    });

    it('Should not successfully logged in because email doesn\'nt exist!', (done) => {
      const user = {
        name: 'Fikri',
        email: 'test01@mail.com',
        password: '123456',
      };

      user.encrypted_password = bcrypt.hashSync(user.password, 10);
      let newUser = new User(user);

      newUser.save().then((data) => {
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
});
