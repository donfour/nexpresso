const path = require('path');
const {
  getAllFiles,
  _isConfigFile,
  _isRouteFile,
  _parsePathComponent,
} = require('./helpers');

describe('getAllFiles', () => {
  test('it should be able to get files recursively in a directory', () => {
    const files = getAllFiles(path.join(__dirname, '../example/server'));
    expect(files.length).toBe(3);
  })
})

describe('_isConfigFile', () => {
  test('a config file should be named nexpress-config.js', () => {
    expect(_isConfigFile('nexpress-config.js')).toBe(true);
  })

  test('a file named anything other than nexpress-config.js is not a config file', () => {
    expect(_isConfigFile('invalid-config.js')).toBe(false);
  })
})

describe('_isRouteFile', () => {
  test('a route file\'s name should be a valid http method', () => {
    expect(_isRouteFile('GET.js')).toBe(true);
  });

  test('it should throw an error if a handler is not of type function', () => {
    expect(_isRouteFile('incorrect-name.js')).toBe(false);
  });
})

describe('_parsePathComponent', () => {
  test('it should parse path parameter correctly', () => {
    expect(_parsePathComponent('[id]')).toBe(':id');
  })

  test('it should leave path component unchanged if it does not match any rule', () => {
    expect(_parsePathComponent('user')).toBe('user');
  })
})