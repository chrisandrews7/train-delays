const journeys = require('../config/journeys.json')

module.exports = () => ({
  getJourneyPairs: () => journeys
});
