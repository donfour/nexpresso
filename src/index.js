const express = require('express');
const {
  getAllFiles,
  createServerObjectFromFiles,
  sortRoutes,
} = require('./helpers');

function nexpresso(options = {}) {
  const { pathToServer } = options;

  if (!pathToServer) {
    throw new Error(
      "You must supply a path to the nexpresso server's root directory"
    );
  }

  const files = getAllFiles(pathToServer);

  const serverObject = createServerObjectFromFiles(pathToServer, files);

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

module.exports = nexpresso;
