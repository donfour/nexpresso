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

For more use cases, see the tests and files in `example`.

## Why?

### Easier to find routes

Finding the entry points to an Express route is often painful. In Nexpresso, finding your routes is easy because `GET /some/route` is simply in the file `/some/route/GET.js`.

### Avoid magical side effects from middlewares

In Express, by changing the order of routes, you can have middlewares affect parts of the app, which is a horrible design. Because you will then have middlewares defined hundreds of lines of code away or even worse, in other files. Nexpresso enforces that middlewares must either affect all endpoints (e.g. `body-parser`) or only one endpoint (e.g. validation, authentication).

### Possibilities for more powerful features

Nexpresso's design opens up opportunities for more features. For one, in addition to exporting a `handler`, we could also export an OpenAPI json object. Then with [express-openapi-validator](https://github.com/cdimascio/express-openapi-validator), we could also provide validations for endpoints; with [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express), we could serve the Swagger UI page.
