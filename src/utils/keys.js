module.exports = {
  generateDelayKey: (from, to) => {
    const now = new Date();
    return `${from}:${to}:${now.getDate()}/${now.getMonth()+1}:delays`;
  }
}