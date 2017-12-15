const { expect } = require('chai');

const filter = require('./delays');

describe('Delay Filter', () => {
  it('should omit services that are On Time', () => {
    expect(filter([
      {
        std: '11:10',
        etd: 'On time'
      }
    ])).to.deep.equal([]);
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
        delay: 10
      },
      {
        std: '11:50',
        etd: '12:10',
        delay: 20
      }
    ]);
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
        delay: 12
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
        delay: undefined
      },
      {
        std: '11:10',
        etd: 'SomeOtherQuestionableStatus',
        delay: undefined
      }
    ]);
  });
});