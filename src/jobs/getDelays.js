const moment = require('moment');
const tableify = require('tableify');
const db = require('../utils/db');
const logger = require('../utils/logger');
const { generateJourneyKey } = require('../utils/keys');
const { getDelays } = require('../repositories/delay')(db);
const { getJourneyPairs } = require('../repositories/journey')(db);
const email = require('../utils/email');

const getJourneyDelays = (from, to) => {
  const ID = generateJourneyKey(from, to);
  return getDelays(ID);
};

const formatDelays = delays => delays.reduce((collection, d) => {
  if (!d) {
    return collection;
  }

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
  
  return collection; 
}, {});

(async () => {
  try {
    const journeys = getJourneyPairs();

    let html = '';

    await Promise.all(journeys.map(async journey => {
      const delays = await getJourneyDelays(journey.from, journey.to);
      logger.info(`${delays.length} ${journey.desc} delays found`);

      html += `<h2>${journey.desc}</h2>`;
      html += tableify(formatDelays(delays));
    }));
    
    const { statusCode } = await email(html);
    logger.info({ statusCode }, 'Email sent');
  }
  catch (err) {
    logger.error({ err }, 'getDelays failed');
  } 
  finally {
    db.quit();
  }
})();
