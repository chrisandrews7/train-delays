const { expect } = require('chai');
const moment = require('moment');
const filter = require('./delays');

describe('Delay Filter', () => {
  const date = moment().format('DD/MM/YY');

  it('should omit services that are On Time', () => {
    expect(filter([
      {
        std: '11:10',
        etd: 'On time'
      }
    ])).to.deep.equal([]);
  });

  it('should remove subsequentCallingPoints', () => {
    expect(filter([
      {
        std: '11:10',
        etd: '11:20',
        subsequentCallingPoints: 'test',
      }
    ], 1)).to.not.have.property('subsequentCallingPoints');
  });

  it('should return the total delay time', () => {
    expect(filter([
      {
        std: '11:10',
        etd: '11:20'
      },
      {
        std: '11:50',
        etd: '12:10'
      }
    ], 1)).to.deep.equal([
      {
        std: '11:10',
        etd: '11:20',
        delay: 10,
        date
      },
      {
        std: '11:50',
        etd: '12:10',
        delay: 20,
        date
      }
    ]);
  });

  it('should return the delay date', () => {
    expect(filter([
      {
        std: '11:10',
        etd: '11:20'
      }
    ], 1)[0].date).to.equal(date);
  });

  it('should omit services that arent past the delay threshold', () => {
    expect(filter([
      {
        std: '11:10',
        etd: '11:20'
      },
      {
        std: '11:10',
        etd: '11:22'
      }
    ], 11)).to.deep.equal([
      {
        std: '11:10',
        etd: '11:22',
        delay: 12,
        date
      }
    ]);
  });

  it('should allow services that are cancelled', () => {
    expect(filter([
      {
        std: '11:10',
        etd: 'Cancelled'
      },
      {
        std: '11:10',
        etd: 'SomeOtherQuestionableStatus',
      }
    ], 11)).to.deep.equal([
      {
        std: '11:10',
        etd: 'Cancelled',
        delay: undefined,
        date
      },
      {
        std: '11:10',
        etd: 'SomeOtherQuestionableStatus',
        delay: undefined,
        date
      }
    ]);
  });
});