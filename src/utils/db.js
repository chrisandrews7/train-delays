const config = require('enviro-conf');
const Redis = require('ioredis');
const client = new Redis(config.get('REDIS_URL'));

module.exports = client;