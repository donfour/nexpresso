const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const nexpress = require('../src');

const app = express();
const port = 8080;

app.use(bodyParser.json())

app.use(nexpress({
  pathToServer: path.join(__dirname, './server'),
}));

app.listen(port, () => {
  console.log(`Server now listening at port ${port}`);
});

// process.on('SIGINT', function () {
//   server.close(function () {
//     console.log(`Server closing down...`);
//     process.exit();
//   });
// });
