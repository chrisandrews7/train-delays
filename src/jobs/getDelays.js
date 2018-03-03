const moment = require('moment');
const tableify = require('tableify');
const db = require('../utils/db');
const logger = require('../utils/logger');
const { generateJourneyKey } = require('../utils/keys');
const { getDelays } = require('../repositories/delay')(db);
const { getJourneyPairs } = require('../repositories/journey')(db);
const email = require('../utils/email');

const getJourneyDelays = async (from, to) => {
  const ID = generateJourneyKey(from, to);
  const delays = await getDelays(ID);
  return delays;
};

(async () => {
  try {
    const journeyDelays = await Promise.all(getJourneyPairs().map(pair => getJourneyDelays(pair.from, pair.to)));
    // Merge all journey delays
    const allDelays = [].concat(...journeyDelays);
    logger.info({ allDelays }, `${allDelays.length} stored delays found`);

    const delays = allDelays.reduce((collection, d) => {
      const delay = JSON.parse(d);

      // Group by date
      if (!collection[d.date]) {
        collection[d.date] = [];
      }
      collection[d.date].push(delay);
      return collection;
    }, {});
    
    await email(tableify(delays));
    logger.info({ statusCode, statusMessage }, 'Email request sent');
  }
  catch (err) {
    logger.error({ err }, 'getDelays failed');
  } 
  finally {
    db.quit();
  }
})();
