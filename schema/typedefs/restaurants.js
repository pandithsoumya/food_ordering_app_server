const {gql} = require('apollo-server-express')

module.exports = gql `

type Restaurant{
    id: Int,
    name : String,
    cuisine : String,
    cost : String,
    rating : Float,
    delivery_time : Int,
    image : String,
    place : String
}

extend type Query{
   getRestaurants : [Restaurant]
}


`
