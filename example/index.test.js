const path = require('path');

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const nexpress = require('../src');

describe('example server', () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(
    nexpress({
      pathToServer: path.join(__dirname, './server'),
    })
  );

  // to create a route, create folder(s) with the url, then create a file with the method name.
  describe('GET /ping', () => {
    test('it should respond with pong', (done) => {
      request(app).get('/ping').expect('pong', done);
    });
  });

  // to create a route that takes a route parameter, create folder(s) in the format [paramName].
  describe('GET /users/:id', () => {
    test('it should respond with :id', (done) => {
      request(app).get('/users/123').expect('123', done);
    });
  });

  // more specific urls always come first (e.g. /users/count comes before /users/:id)
  describe('GET /users/count', () => {
    test('it should respond with "You have hit GET /users/count"', (done) => {
      request(app)
        .get('/users/count')
        .expect('You have hit GET /users/count', done);
    });
  });

  describe('POST /users/:id', () => {
    // to create a route that takes a body, make sure to set up bodyParser (see index.js)
    test('it should respond with the body sent', (done) => {
      const user = { name: 'John' };
      request(app).post('/users/123').send(user).expect(200, user, done);
    });

    // middlewares can be used by exporting an array of functions as handler (see /users/[id]/POST.js)
    test('it should respond with 400 when name is not set', (done) => {
      const user = {};
      request(app).post('/users/123').send(user).expect(400, done);
    });
  });
});
