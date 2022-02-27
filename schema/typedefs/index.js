const { gql } = require('apollo-server-express')
const user = require('./user')
const restaurants = require('./restaurants')



const base = gql `

type Query {
    _base : String
}
type Mutation {
    _base : String
}

`
module.exports = [
    base, user, restaurants
]
