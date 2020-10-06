const path = require('path');
const {
  getAllFiles,
  _isRouteFile,
  _parsePathComponent,
  sortRoutes,
  createServerObjectFromFiles,
} = require('./helpers');

describe('getAllFiles', () => {
  test('it should be able to get files recursively in a directory', () => {
    const files = getAllFiles(path.join(__dirname, '../example/server'));
    expect(files.length).toBe(4);
  });
});

describe('_isRouteFile', () => {
  test('it should return true for file names that are valid http methods', () => {
    expect(_isRouteFile('GET.js')).toBe(true);
  });

  test('it should return false for file names that are not valid http methods', () => {
    expect(_isRouteFile('incorrect-name.js')).toBe(false);
  });
});

describe('_parsePathComponent', () => {
  test('it should parse path parameter correctly', () => {
    expect(_parsePathComponent('[id]')).toBe(':id');
  });

  test('it should leave path component unchanged if it does not match any rule', () => {
    expect(_parsePathComponent('user')).toBe('user');
  });
});

describe('sortRoutes', () => {
  test('/route should be placed before /:id', () => {
    expect(['/:id', '/route'].sort(sortRoutes)).toStrictEqual([
      '/route',
      '/:id',
    ]);
  });
});

describe('createServerObjectFromFiles', () => {
  test('it should log a warning when no route is created', () => {
    console.warn = jest.fn();

    createServerObjectFromFiles('', []);

    expect(console.warn.mock.calls[0][0]).toBe(
      'No route created. Please check the following:\n- whether pathToServer option is set correctly\n- whether your file names are valid HTTP verbs\n- whether you have exported a handler from each file'
    );
  });
});
