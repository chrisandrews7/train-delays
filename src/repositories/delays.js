module.exports = db => ({
  addDelays: (journeyId, delays) => {
    const hashes = delays.reduce((collection, delay) => {
      collection.push(delay.serviceId);
      collection.push(JSON.stringify(delay));
      return collection;
    }, []);
    return db.hmset(journeyId, ...hashes);
  },
  getDelays: (journeyId) => db.hgetall(journeyId)
});
