const { expect } = require('chai');
const { stub } = require('sinon');

const repo = require('./delays');

describe('Delays Repository', () => {
  describe('addDelays()', () => {
    it('should add the delays to a hash using the serviceId as a key', () => {
      const mockDb = {
        multi: stub().returnsThis(),
        expire: stub().returnsThis(),
        hmset: stub().returns('results!')
      };

      const result = repo(mockDb).addDelays('testId', [
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
      expect(mockDb.expire.calledWithExactly(
        'testId', 1209600
      )).to.be.true;
      expect(mockDb.hmset.calledWithExactly(
        'testId',
        123,
        '{"serviceId":123,"testing":"value"}',
        456,
        '{"serviceId":456,"test":"check"}'
      )).to.be.true;
    });
  });
  
  describe('getDelays()', () => {
    it('should get all the delays for a journey', () => {
      const mockDb = {
        hgetall: stub().returns('results!')
      };
      
      const result = repo(mockDb).getDelays('testId');
      
      expect(result).to.equal('results!');
      expect(mockDb.hgetall.calledWithExactly('testId')).to.be.true;
    });
  });
});