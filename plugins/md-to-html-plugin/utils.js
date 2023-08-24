function getRandom() {
    const timestamp = Date.now();
    const randomFactor = Math.random();
    return Math.floor(timestamp * randomFactor);
}

module.exports = {
    getRandom
}