const { createError } = require('micro')

module.exports = async (req, res) => {
  throw createError(400, 'ERROR THROWING LAMBDA')
}
