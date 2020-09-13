const express = require('express');
const util = require('util');
const { getAllFiles, createServerObjectFromFiles, getRequestValidator } = require('./helpers');

function nexpress(options = {}) {
  const { pathToServer } = options;

  if (!pathToServer) {
    throw new Error('You must supply a path to the nexpress server\'s root directory');
  }

  const result = getAllFiles(pathToServer);

  console.log('result', result); // DEBUG

  const serverObject = createServerObjectFromFiles(pathToServer, result);

  console.log('serverObject', util.inspect(serverObject, showHidden = false, depth = 3, colorize = true)); // DEBUG

  const router = express.Router();

  Object.entries(serverObject.api).forEach(([path, apiObj]) => {
    Object.entries(apiObj).forEach(([method, api]) => {
      const {
        request,
        handler
      } = api;

      console.log(`Setting ${method} ${path}`);

      const requestValidations = Object.entries(request || {}).map(([segment, validation]) => {
        return getRequestValidator(segment, validation);
      })

      router[method](path, [...requestValidations, handler]);
    })
  })

  return router;
}

module.exports = nexpress;