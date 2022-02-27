const {gql} = require('apollo-server-express')

module.exports = gql `

type User{
    userID:Int,
    userName:String,
    email:String,
    role : String
    lastActive:String,
    lastLogin:String,
    isActive:Int
}

input RegisterUserInput {
    email: String!,
    password: String!
}

input UserLoginInput {
    email:String!,
    password:String!
}

extend type Query {
    loginUser(input:UserLoginInput): String
    validateUser: String
}

extend type Mutation {
    registerUser(input:RegisterUserInput):User,
    logoutUser:Boolean    
}

`
