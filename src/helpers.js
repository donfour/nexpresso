const fs = require('fs');
const path = require('path');

function getAllFiles(currentDir, arrayOfFiles = []) {
  files = fs.readdirSync(currentDir);

  files.forEach(function (file) {
    const pathToFile = `${currentDir}/${file}`;
    if (fs.statSync(pathToFile).isDirectory()) {
      arrayOfFiles = getAllFiles(pathToFile, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(currentDir, file));
    }
  });

  return arrayOfFiles;
}

function createServerObjectFromFiles(pathToServer, filePaths) {
  const result = {
    api: {},
  };

  // read route files
  filePaths.forEach((filePath) => {
    if (!_isRouteFile(filePath)) {
      return;
    }

    const method = path.parse(filePath).name.toLowerCase();

    const { handler } = require(filePath);

    if (!handler) {
      return;
    }

    if (handler && !_isValidHandler(handler)) {
      throw new Error(
        `Invalid handler from file: ${filePath}. It can only be a function, or an array of functions.`
      );
    }

    // TODO: support linux
    const route =
      '/' +
      path
        .relative(pathToServer, filePath)
        .split('\\')
        .slice(0, -1)
        .map(_parsePathComponent)
        .join('/');

    if (!result.api[route]) {
      result.api[route] = {};
    }

    result.api[route][method] = {
      handler,
    };
  });

  if (Object.keys(result.api).length === 0) {
    console.warn(
      'No route created. Please check the following:\n- whether pathToServer option is set correctly\n- whether your file names are valid HTTP verbs\n- whether you have exported a handler from each file'
    );
  }

  return result;
}

function _isRouteFile(filePath) {
  const methods = require('methods');
  const { name, ext } = path.parse(filePath);
  return methods.includes(name.toLowerCase()) && ext === '.js';
}

function _parsePathComponent(pathComponent) {
  const matchPathParam = /\[(.*)\]/.exec(pathComponent);

  if (matchPathParam) {
    return `:${matchPathParam[1]}`;
  }

  return pathComponent;
}

function _isValidHandler(handler) {
  if (typeof handler === 'function') {
    return true;
  }

  if (Array.isArray(handler)) {
    return handler.every((h) => typeof h === 'function');
  }

  return false;
}

function sortRoutes(a, b) {
  // sort strings descendingly
  return a > b ? -1 : 1;
}

module.exports = {
  getAllFiles,
  createServerObjectFromFiles,
  _isRouteFile,
  _parsePathComponent,
  sortRoutes,
};
