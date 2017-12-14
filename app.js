var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

const i18n = require("./utils/i18nConfig");

// Paths Routes
var basePath = "/";
var usersPath = "/users";
var productPath = "/products";
var apiPath = "/api";

// Load handlers
var index = require("./routes/index");
var users = require("./routes" + apiPath + usersPath);
var products = require("./routes" + apiPath + productPath);

var app = express();

// Load connect Mongoose
require("./lib/connectMongoose");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(i18n.init);

// Load routes
app.use(basePath, index);
app.use(apiPath + usersPath, users);
app.use(apiPath + productPath, products);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error(__("not_found"));
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // Error of express-validator
  if (err.array) {
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req)
      ? { message: __("not_valid"), errors: err.mapped() } // para peticones de API
      : `Not valid - ${errInfo.param} ${errInfo.msg}`; // para otras peticiones
  }
  res.status(err.status || 500);

  // If API return JSON
  if (isAPI(req)) {
    // console.error( __('generic', { err }) );
    // res.json({ success: false, error: "API: " + err.message });
    res.json({ success: false, error: err });
    return;
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.render("error");
});

function isAPI(req) {
  return req.originalUrl.indexOf(apiPath) === 0;
}

module.exports = app;
