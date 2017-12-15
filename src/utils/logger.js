const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'delays-app' });
module.exports = logger;
