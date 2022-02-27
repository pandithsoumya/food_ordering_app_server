const user = require('./user')
const restaurants = require('./restaurants')
const { merge} = require('lodash')

module.exports = merge({}, user , restaurants)