const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo(session);
const mongoose = require("mongoose");
const config = require("./../config");

const MONGODB_URI = `mongodb://${config.MONGODB_HOST}/${config.MONGODB_SESSION}`;

module.exports = session(
  {
    secret: 'secret-hello-world',
    resave: true,
    saveUninitialized: true,
    maxAge: new Date(Date.now() + 60 * 60 * 1000 ),
    name:'s-e-s-s-i-o-n',
    stringify: true,
    ttl:1*24*60*60,//1 dia 
    collection: config.MONGODB_SESSION_COLLECTION,
    store: new MongoStore({ url: MONGODB_URI })
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }
)
