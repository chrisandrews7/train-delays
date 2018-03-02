const moment = require('moment');
const db = require('../utils/db');
const logger = require('../utils/logger');
const { generateJourneyKey } = require('../utils/keys');
const { getDelays } = require('../repositories/delay')(db);
const { getJourneyPairs } = require('../repositories/journey')(db);

const getJourneyDelays = async (from, to) => {
  const ID = generateJourneyKey(from, to);
  const delays = await getDelays(ID);
  return delays;
};

(async () => {
  try {
    const journeyDelays = await Promise.all(getJourneyPairs().map(pair => getJourneyDelays(pair.from, pair.to)));
    const allDelays = journeyDelays.reduce((collection, delays) => {
      if (delays) {
        Object.values(delays).forEach((delay => collection.push(JSON.parse(delay))));
      }
      return collection;
    }, []);
    logger.info({ delays: allDelays }, `${allDelays.length} stored delays found`);
  }
  catch (err) {
    logger.error({ err }, 'getDelays failed');
  } 
  finally {
    db.quit();
  }
})();
