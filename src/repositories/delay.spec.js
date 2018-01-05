const { expect } = require('chai');
const { stub } = require('sinon');

const repo = require('./delay');

describe('Delay Repository', () => {
  describe('addDelays()', () => {
    it('should add the delays to a hash using the serviceId as a key', () => {
      const mockDb = {
        multi: stub().returnsThis(),
        exec: stub().returns('results!'),
        mset: stub().returnsThis(),
        sadd: stub().returnsThis()
      };

      const result = repo(mockDb).addDelays('testJourneyId', [
        {
          serviceId: 123,
          testing: 'value'
        },
        {
          serviceId: 456,
          test: 'check'
        }
      ]);

      expect(result).to.equal('results!');

      expect(mockDb.mset.calledWithExactly(
        ['delay:123', '{"serviceId":123,"testing":"value"}'],
        ['delay:456', '{"serviceId":456,"test":"check"}']
      )).to.be.true;

      expect(mockDb.sadd.calledWithExactly(
        'testJourneyId',
        'delay:123',
        'delay:456'
      )).to.be.true;
    });
  });
  
  describe('getDelays()', () => {
    it('should get all the delays for a journey', async () => {
      const mockDb = {
        smembers: stub().resolves(['delay:1234', 'delay:5678']),
        mget: stub().returns('results!')
      };
      
      const result = await repo(mockDb).getDelays('testJourneyId');
      
      expect(result).to.equal('results!');
      expect(mockDb.smembers.calledWithExactly('testJourneyId')).to.be.true;
      expect(mockDb.mget.calledWithExactly('delay:1234', 'delay:5678')).to.be.true;
    });

    it('should return an empty array if no delays are found', async () => {
      const mockDb = {
        smembers: stub().resolves([]),
        mget: stub().rejects('error!')
      };
      
      const result = await repo(mockDb).getDelays('testJourneyId');
      
      expect(result).to.deep.equal([]);
      expect(mockDb.mget.notCalled).to.be.true;
    });
  });
});