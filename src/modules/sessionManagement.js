const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo(session);
const mongoose = require("mongoose");

module.exports = session({
  secret: 'secret-hello-world',
  resave: true,
  saveUninitialized: true,
  maxAge: new Date(Date.now() + 3600000),
  name:'sessionId',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
})
