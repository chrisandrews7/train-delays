const db = require('../utils/db');
const logger = require('../utils/logger');
const { generateJourneyKey } = require('../utils/keys');
const { getJourneys } = require('../apis/darwin');
const { addDelays } = require('../repositories/delays')(db);
const filterForDelays = require('../filters/delays');

const saveJourneyDelays = async (from, to, threshold) => {
  const ID = generateJourneyKey(from, to);

  const journeys = await getJourneys(from, to);
  const delays = filterForDelays(journeys.trainServices, threshold);
  if (delays.length) {
    await addDelays(ID, delays);
  }

  logger.info(`${ID} - ${delays.length} valid delay(s) found`, delays);
};

const processAllJourneys = async () => {
  try {
    await Promise.all([
      saveJourneyDelays('WAL', 'WAT', 15), 
      saveJourneyDelays('WAT', 'WAL', 15)
    ]);
    logger.info('saveDelays ran successfully');
  }
  catch (err) {
    logger.error('saveDelays failed', err);
  } 
  finally {
    db.quit();
  }
};

processAllJourneys();
