module.exports = {
  generateDelayKey: serviceId => `delay:${serviceId}`,
  generateJourneyKey: (from, to) =>  `journey:${from}:${to}`
}