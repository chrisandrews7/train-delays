const moment = require('moment');

module.exports = (services, threshold) => 
  services
    .filter(service => service.etd !== 'On time')
    .map(service => {
      const etd = moment(service.etd, 'HH:mm');
      const std = moment(service.std, 'HH:mm');
      service.delay = etd.diff(std, 'minutes') || undefined;
      return service;
    })
    .filter(service => !service.delay || service.delay > threshold);
