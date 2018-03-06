const config = require('enviro-conf');
const Rail = require('national-rail-darwin');
const { promisify } = require('util');

const { SEARCH_TIME_WINDOW } = require('../config/app');

const client = new Rail(config.get('NR_API_KEY'));

module.exports = {
  getJourneys: (from, to) => promisify(client.getDepartureBoardWithDetails.bind(client))(from, { 
    destination: to,
    rows: 1000,
    timeOffset: SEARCH_TIME_WINDOW
  })
};
