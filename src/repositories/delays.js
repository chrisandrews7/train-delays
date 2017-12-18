module.exports = db => ({
  addDelays: (journeyId, delays) => {
    const properties = delays.reduce((collection, delay) => {
      collection.push(delay.serviceId);
      collection.push(JSON.stringify(delay));
      return collection;
    }, []);
    
    return db
      .multi()
      .expire(journeyId, 1209600) // 14 Days
      .hmset(journeyId, ...properties);
  },
  getDelays: (journeyId) => db.hgetall(journeyId)
});
