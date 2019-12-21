const moment = require('moment');

// configure middleware
const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}: ${moment().format()}`);
  // @todo: save this console log into a file with fs module for a server log ..
  next();
}

module.exports = logger;