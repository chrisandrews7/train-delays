module.exports = (services, threshold) => 
  services
    .filter(service => service.etd !== 'On time')
    .map(service => ({ 
      ...service, 
      delay: service.etd.replace(':', '') - service.std.replace(':', '') || undefined
    }))
    .filter(service => !service.delay || service.delay > threshold);
