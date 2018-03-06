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
    const storedDelays = [].concat(...journeyDelays);
    logger.info({ delays: storedDelays }, `${storedDelays.length} stored delays found`);

    const delays = storedDelays.reduce((collection, d) => {
      if (d) {
        const delay = JSON.parse(d);
        // Group by date
        if (!collection[delay.date]) {
          collection[delay.date] = [];
        }
        collection[delay.date].push({
          Scheduled: delay.std,
          Actual: delay.etd,
          Delay: delay.delay,
          Operator: delay.operatorCode,
          Origin: delay.origin.name,
          Destination: delay.destination.name
        });
      }
      
      return collection;
    }, {});
    
    const result = await email(tableify(delays));
    logger.info({ result }, 'Email client response');
  }
  catch (err) {
    logger.error({ err }, 'getDelays failed');
  } 
  finally {
    db.quit();
  }
})();
