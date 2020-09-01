const path = require('path');

const request = require('supertest');
const express = require('express');

const nexpress = require('../src');

describe('example server', () => {
  const app = express();
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
})