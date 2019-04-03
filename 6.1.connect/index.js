const connect = require("connect");
const env = process.env.NODE_ENV || "development";

/**
 * middleware
 */
function logger(req, res, next) {
  console.log("%s %s", req.method, req.url);
  next();
}

function hello(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
}

/**
 * configurable middleware
 */
function setup(format) {
  const regexp = /:(\w+)/g;
  return function createLogger(req, res, next) {
    const str = format.replace(regexp, (match, property) => {
      console.log(property, req[property]);
      req(property); // throw error
      return req[property];
    });

    console.log(str);
    next();
  };
}

/**
 * error-handling middleware
 */
function errorHandler(err, req, res, next) {
  res.statusCode = 500;
  switch (env) {
    case "development":
      res.setHeader("Content-Type", "application/json");
      res.end(err.message);
      break;
    default:
      res.end("Server Error");
  }
}

connect()
  // .use(logger)
  .use(setup(":method :url"))
  .use(hello)
  .use(errorHandler)
  .listen(3000);
