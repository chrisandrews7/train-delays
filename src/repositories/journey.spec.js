const { expect } = require('chai');
const journeys = require('../config/journeys.json');

const repo = require('./journey');

describe('Journey Repository', () => {
  describe('getJourneyPairs()', () => {
    it('should return all of the journey pairs', () => {      
      const result = repo().getJourneyPairs();
      expect(result).to.deep.equal(journeys);
    });
  });
});