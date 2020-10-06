## Nexpresso

An Express middleware that turns your file directories into API endpoints.

Inspired by Next.js, so... thank you, next! (pun intended)

### Getting started

Install Express and Nexpresso:

```
yarn add express nexpresso
```

You first need to create a root directory (e.g. `/server`) for your Nexpresso files. Then, as an example, to create `GET /some/route`, you create the file `/server/some/route/GET.js`. Inside `GET.js`, you have to export a handler function like so:

```js
// Example 1
// server/some/route/GET.js
const greet = (req, res) => {
  return res.send('Hello world!');
};

module.exports = { handler: greet };
```

`handler` can also be an array of handler functions, in case you wish to add middlewares:

```js
// Example 2
// server/some/route/GET.js
const log = (req, res, next) => {
  console.log('I am called!');
  next();
};

const greet = (req, res) => {
  return res.send('Hello world!');
};

module.exports = { handler: [log, greet] };
```

To set up nexpresso, simply import Nexpresso and pass it to `app.use()` as a middleware.

```js
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const nexpresso = require('nexpresso');

const app = express();
const port = 8080;

app.use(bodyParser.json());

// set up Nexpresso
app.use(
  nexpresso({
    pathToServer: path.join(__dirname, './server'),
  })
);

app.listen(port, () => {
  console.log(`Server now listening at port ${port}`);
});
```

To test, run the file locally and visit `http://localhost:8080/some/route`. You should see "Hello World!" as a response.
