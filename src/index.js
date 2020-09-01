const fs = require('fs');
const path = require('path');
const express = require('express');
const util = require('util');
const { getAllFiles, createServerObjectFromFiles } = require('./helpers');

function nexpress(options = {}){
  const { pathToServer } = options;

  if(!pathToServer){
    throw new Error('You must supply a path to the nexpress server\'s root directory');
  }
  
  const result = getAllFiles(pathToServer);
  
  console.log('result', result); // DEBUG

  const serverObject = createServerObjectFromFiles(pathToServer, result);

  console.log('serverObject', util.inspect(serverObject, showHidden=false, depth=null, colorize=true)); // DEBUG
  
  const router = express.Router();
  
  Object.entries(serverObject.api).forEach(([path, apiObj]) => {
    Object.entries(apiObj).forEach(([method, { handler }]) => {
      console.log(`Setting ${method} ${path}`);
      router[method](path, handler);
    })
  })

  return router;
}

module.exports = nexpress;