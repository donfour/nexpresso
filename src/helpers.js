const fs = require('fs');
const path = require('path');
const Joi = require('joi');

function getAllFiles(currentDir, arrayOfFiles = []) {
  files = fs.readdirSync(currentDir)

  files.forEach(function (file) {
    const pathToFile = `${currentDir}/${file}`;
    if (fs.statSync(pathToFile).isDirectory()) {
      arrayOfFiles = getAllFiles(pathToFile, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(currentDir, file))
    }
  })

  return arrayOfFiles
}

function createServerObjectFromFiles(pathToServer, filePaths) {
  const result = {
    // TODO: remove port, onStartup, onShutdown if not needed
    port: 8080,
    onStartup: () => { },
    onShutdown: () => { },
    api: {},
  };

  // read config file
  const configFilePath = filePaths.find(_isConfigFile);

  if (configFilePath) {
    const { port, onStartup, onShutdown } = require(configFilePath);
    if (port) result.port = port;
    if (onStartup) result.onStartup = onStartup;
    if (onShutdown) result.onShutdown = onShutdown;
  }

  // read route files
  filePaths.forEach(filePath => {
    if (!_isRouteFile(filePath)) {
      return;
    }

    const method = path.parse(filePath).name.toLowerCase();

    const {
      request,
      handler
    } = require(filePath);

    if (!_isValidHandler(handler)) {
      throw new Error(`Invalid handler in file: ${filePath}`);
    }

    // TODO: support linux
    const route = '/' + path.relative(pathToServer, filePath).split('\\').slice(0, -1).map(_parsePathComponent).join('/');

    if (!result.api[route]) {
      result.api[route] = {};
    }

    result.api[route][method] = {
      request,
      handler
    };
  });

  return result;
}

function _isConfigFile(filePath) {
  return path.parse(filePath).base === 'nexpress-config.js';
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
    return handler.every(h => typeof h === 'function');
  }

  return false;
}


function getRequestValidator(segment, validation) {
  const SUPPORTED_SEGMENTS = ['body'];
  const isSupported = SUPPORTED_SEGMENTS.includes(segment);
  const { schema, options } = validation;

  return (req, res, next) => {
    if (!schema) {
      console.warn(`Skipping request.${segment} validation because schema is not set.`);
      return next();
    }

    if (!isSupported) {
      console.warn(`Skipping request.${segment} validation because it is not one of ${SUPPORTED_SEGMENTS.join(',')}.`);
      return next();
    }

    if(Joi.isSchema(schema)){
      const { error, value } = schema.validate(req[segment], options || {});
      
      if(error) {
        // TODO: support custom onFail behaviors
        return res.status(400).send(error.message);
      }

      req[segment] = value;
    } else {
      // TODO: support other ways of defining schema
      console.warn(`request.${segment}.schema is not a Joi schema.`)
    }

    next();
  }
};

module.exports = {
  getAllFiles,
  createServerObjectFromFiles,
  _isConfigFile,
  _isRouteFile,
  _parsePathComponent,
  getRequestValidator,
};