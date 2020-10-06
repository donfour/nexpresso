const express = require('express');
const util = require('util');
const {
  getAllFiles,
  createServerObjectFromFiles,
  sortRoutes,
} = require('./helpers');

function nexpress(options = {}) {
  const { pathToServer } = options;

  if (!pathToServer) {
    throw new Error(
      "You must supply a path to the nexpress server's root directory"
    );
  }

  const files = getAllFiles(pathToServer);

  const serverObject = createServerObjectFromFiles(pathToServer, files);

  // DEBUG
  // console.log(
  //   'serverObject',
  //   util.inspect(
  //     serverObject,
  //     (showHidden = false),
  //     (depth = 3),
  //     (colorize = true)
  //   )
  // );

  const router = express.Router();

  const routes = Object.keys(serverObject.api).sort(sortRoutes);

  routes.forEach((route) => {
    Object.entries(serverObject.api[route]).forEach(([method, api]) => {
      const { handler } = api;
      router[method](route, handler);
    });
  });

  return router;
}

module.exports = nexpress;
