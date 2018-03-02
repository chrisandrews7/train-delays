const config = require('enviro-conf');
const Rail = require('national-rail-darwin');
const { promisify } = require('util');

const client = new Rail(config.get('NR_API_KEY'));

module.exports = {
  getJourneys: (from, to) => promisify(client.getDepartureBoardWithDetails.bind(client))(from, { 
    destination: to,
    rows: 1000,
    timeOffset: -120
  })
};