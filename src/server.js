require('dotenv').config();
const express = require("express");
const path = require("path");
const favicon = require('serve-favicon');
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");

const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");
const helmet = require("helmet");

const { createAdminUser } = require("./libs/createUser");
const { json, select, compare, math } = require("./helpers/handlebars");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var tools = require('./modules/tools');
var sessionManagement = require('./modules/sessionManagement');
const accessLogStream = require("./middleware/log")

// Initializations
const app = express();
require("./config/passport");
createAdminUser();
app.set('executionsThisTime', 0);

// settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(handlebars),
    helpers: {
      "select":select,
      "json": json,
      "moment": require('helper-moment'),
      'compare': compare,
      "progress":  function (n, d) {return (100*n)/d },
      "math":math
      }
    })
  );
app.set("view engine", ".hbs"); 

// middlewares
app.use(helmet());
app.use(accessLogStream); 
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.set('trust proxy', 1) // trust first proxy
app.use(sessionManagement)
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// General toolset
// on request start and on request end moved after static content
app.use(tools.onRequestStart);
app.use(tools.onRequestEnd);
// generate menu of the application
app.use(tools.generateMenu);

// routes
app.use(require("./routes/index.routes"));
app.use(require("./routes/users.routes"));
app.use(require("./routes/roles.routes"));
app.use(require("./routes/settings.routes"));
app.use(require("./routes/doctors.routes"));
app.use(require("./routes/patients.routes"));

// static files
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, 'public/img/', 'favicon.ico')));


app.use((req, res) => {
  res.render("404");
});

module.exports = app;