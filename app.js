let express = require("express");
let path = require("path");
let cors = require("cors");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let errorHandler = require("./middleware/middleware.error");
let { errorHandle } = require("./core");

const bodyParser = require("body-parser");
let app = express();

global.fetch = require("node-fetch");

// view engine setup
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

// enable cross origin

// set security guard
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.use(logger("dev"));
app.use(bodyParser.json({ verify: (req, res, buf) => (req.rawBody = buf) }));

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// all app here
require("./startup/routes")(app);

// after all route, show 404
app.use("*", (req, res) => {
  throw new errorHandle("Resource not found", 404);
});

// Add custom error handling controller
app.use(errorHandler);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
process.on("uncaughtException", function (err) {
  console.error(err);
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
