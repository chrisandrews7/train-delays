const config = require('enviro-conf');
const redis = require('promise-redis')();
const client = redis.createClient({
  url: config.get('REDIS_URL'),
});

module.exports = client;