const sleep = require('then-sleep')

module.exports = async (req, res) => {
  await sleep(1000)
  res.end('ASYNC LAMBDA')
}
