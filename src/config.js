module.exports = {
  PORT: process.env.PORT || 4000,
  MONGODB_HOST: process.env.MONGODB_HOST || 'localhost',
  MONGODB_DATABASE: process.env.MONGODB_DB || 'care-app',
  MONGODB_SESSION: process.env.MONGODB_SESSION || 'session-care-app',
  MONGODB_SESSION_COLLECTION: process.env.MONGODB_SESSION_COLLECTION || 'sessions'
}