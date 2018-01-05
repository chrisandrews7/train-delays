const moment = require('moment');
const db = require('../utils/db');
const logger = require('../utils/logger');
const { generateJourneyKey } = require('../utils/keys');
const { getDelays } = require('../repositories/delays')(db);

const getJourneyDelays = async (from, to) => {
  const ID = generateJourneyKey(from, to);
  const delays = await getDelays(ID);
  return delays;
};

const processAllJourneys = async () => {
  try {
    const journeyDelays = await Promise.all([
      getJourneyDelays('WAL', 'WAT'), 
      getJourneyDelays('WAT', 'WAL')
    ]);
    const allDelays = journeyDelays.reduce((collection, delays) => {
      if (delays) {
        Object.values(delays).forEach((delay => collection.push(delay)));
      }
      return collection;
    }, []);
    logger.info(`getDelays: ${allDelays.length} stored delays found`, allDelays);
  }
  catch (err) {
    logger.error('getDelays failed', err);
  } 
  finally {
    db.quit();
  }
};

processAllJourneys();