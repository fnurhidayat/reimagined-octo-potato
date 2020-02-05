const chai = require('chai');

const {
  expect,
  should,
} = chai;

const http = require('chai-http');

chai.use(http);

const app = require('../index.js');

describe('Root Endpoint', function() {
  it('Should return true and give hello world message', function() {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.eq(true);
        expect(res.body.data).to.eq('Hello World');
      });
  });
});
