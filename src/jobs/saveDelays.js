const db = require('../utils/db');
const logger = require('../utils/logger');
const { generateJourneyKey } = require('../utils/keys');
const { getJourneys } = require('../apis/darwin');
const { addDelays } = require('../repositories/delay')(db);
const { getJourneyPairs } = require('../repositories/journey')(db);
const filterForDelays = require('../filters/delays');

const { DELAY_THRESHOLD } = require('../config/app');

const saveJourneyDelays = async (from, to) => {
  const ID = generateJourneyKey(from, to);

  const journeys = await getJourneys(from, to);
  const delays = filterForDelays(journeys.trainServices, DELAY_THRESHOLD);
  if (delays.length) {
    await addDelays(ID, delays);
  }

  logger.info({ delays }, `${ID} - ${delays.length} valid delay(s) found`);
};

(async () => {
  try {
    await Promise.all(getJourneyPairs().map(pair => saveJourneyDelays(pair.from, pair.to)));
    logger.info('saveDelays ran successfully');
  }
  catch (err) {
    logger.error({ err }, 'saveDelays failed');
  } 
  finally {
    db.quit();
  }
})();
