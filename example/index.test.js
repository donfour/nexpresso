const path = require('path');

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const nexpress = require('../src');

describe('example server', () => {
  const app = express();
  app.use(bodyParser.json())
  app.use(nexpress({
    pathToServer: path.join(__dirname, './server'),
  }))

  describe('GET /ping', () => {
    test('it should respond with pong', done => {
      request(app)
        .get('/ping')
        .expect('pong', done)
    })
  })

  describe('GET /user/:id', () => {
    test('it should respond with :id', done => {
      request(app)
        .get('/user/123')
        .expect('123', done)
    })
  })

  describe('POST /user/:id', () => {
    test('it should respond with the body sent', done => {
      const user = { name: 'John' };
      request(app)
        .post('/user/123')
        .send(user)
        .expect(200, user, done);
    })

    test('it should respond with 400 when name is not set', done => { 
      const user = {};
      request(app)
        .post('/user/123')
        .send(user)
        .expect(400, done);
    })
  })
})