const logger = require('./utils/logger');
const db = require('./utils/db');
const saveDelays = require('./jobs/saveDelays');

const run = async () => {
  try {
    await Promise.all([
      saveDelays('WAL', 'WAT', 30), 
      saveDelays('WAT', 'WAL', 30)
    ]);
    logger.info('saveAllJourneyDelays ran successfully');
  }
  catch (err) {
    logger.error('saveAllJourneyDelays failed', err);
  } 
  finally {
    db.quit();
  }
};

run();