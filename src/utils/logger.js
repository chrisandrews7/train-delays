const pino = require('pino');
const logger = pino({
  serializers: pino.stdSerializers
});
module.exports = logger;
