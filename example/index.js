const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const nexpresso = require('../src');

const app = express();
const port = 8080;

app.use(bodyParser.json());

app.use(
  nexpresso({
    pathToServer: path.join(__dirname, './server'),
  })
);

app.listen(port, () => {
  console.log(`Server now listening at port ${port}`);
});
