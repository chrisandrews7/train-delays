const moment = require('moment');
const db = require('../utils/db');
const logger = require('../utils/logger');
const { generateDelayKey } = require('../utils/keys');
const { getDelays } = require('../repositories/delays')(db);

module.exports = async (from, to) => {
  const ID = generateDelayKey(from, to, moment().subtract(1, 'day'));
  const delays = await getDelays(ID);
  return delays;
};
