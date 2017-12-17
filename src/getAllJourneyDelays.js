const logger = require('./utils/logger');
const db = require('./utils/db');
const getDelays = require('./jobs/getDelays');

const run = async () => {
  try {
    const journeyDelays = await Promise.all([
      getDelays('WAL', 'WAT'), 
      getDelays('WAT', 'WAL')
    ]);
    const allDelays = journeyDelays.reduce((collection, delays) => {
      if (delays) {
        Object.values(delays).forEach((delay => collection.push(delay)));
      }
      return collection;
    }, []);
    logger.info(`${allDelays.length} stored delays found`, allDelays);
  }
  catch (err) {
    logger.error('Problem getting delays', err);
  } 
  finally {
    db.quit();
  }
};

run();