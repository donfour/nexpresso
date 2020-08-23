const fs = require('fs');
const path = require('path');

const pathToServer = process.argv[2];

if(!pathToServer){
  throw new Error('You must supply a path to the project\'s root directory');
}

const directories = fs.readdirSync(
  path.join(process.cwd(), pathToServer)
);

if(!directories.includes('server')){
  throw new Error('Your project\'s root must include a directory named "server"');
}

const getAllFiles = function(currentDir, arrayOfFiles = []) {
  files = fs.readdirSync(currentDir)

  files.forEach(function(file) {
    const pathToFile = `${currentDir}/${file}`;
    if (fs.statSync(pathToFile).isDirectory()) {
      arrayOfFiles = getAllFiles(pathToFile, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, currentDir, "/", file))
    }
  })

  return arrayOfFiles
}

const result = getAllFiles(path.join(process.cwd(), pathToServer, 'server'));

console.log(result);

// const server = {
//   configs: {
//     port: 8080,
//     onStartup: () => {},
//     onShutdown: () => {},
//   },
//   paths: {
//     api: {
//       blogs: {
//         GET: {},
//         POST: {},
//         '[id]': {
//           GET: {},
//           PUT: {},
//           DELETE: {},
//         }
//       }
//     }
//   }
// };

// console.log(directories);