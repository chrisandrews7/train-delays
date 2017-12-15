const moment = require('moment');

module.exports = {
  generateDelayKey: (from, to) =>  `${from}:${to}:${moment().format('DD/MM/YY')}:delays`
}