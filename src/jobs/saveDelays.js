const db = require('../utils/db');
const logger = require('../utils/logger');
const { generateDelayKey } = require('../utils/keys');
const { getJourneys } = require('../repositories/journeys');
const { addDelays } = require('../repositories/delays')(db);
const filterForDelays = require('../filters/delays');

module.exports = async (from, to, threshold) => {
  const ID = generateDelayKey(from, to);

  const journeys = await getJourneys(from, to);
  const delays = filterForDelays(journeys.trainServices, threshold);
  if (delays.length) {
    await addDelays(ID, delays);
  }

  logger.info(`${ID} - ${delays.length} valid delay(s) found`, delays);
};
