module.exports = {
  generateDelayKey: (from, to, date) =>  `delays:${from}:${to}:${date.format('DD/MM/YY')}`
}