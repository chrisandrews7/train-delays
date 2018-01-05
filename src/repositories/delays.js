const { generateDelayKey } = require('../utils/keys');

module.exports = db => ({
  addDelays: (journeyId, delays) => {
    const entries = delays.reduce((collection, delay) => {
      collection[generateDelayKey(delay.serviceId)] = JSON.stringify(delay);
      return collection;
    }, {});
    
    return db
      .multi()
      .mset(...Object.entries(entries))
      .sadd(journeyId, ...Object.keys(entries));
  },
  getDelays: async (journeyId) => {
    const delayIds = await db.smembers(journeyId);
    if (!delayIds.length) {
      return [];
    }
    return db.mget(...delayIds);
  }
});
