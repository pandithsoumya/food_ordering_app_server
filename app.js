const express = require('express');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const  typeDefs = require('./schema').typeDefs
const resolvers = require('./schema').resolvers
const cors = require('cors') 


/**
 * Combining the typeDefs and resolvers to generate a single schema
 */
const schema = makeExecutableSchema({typeDefs, resolvers})


// Creating the express app
const app = express();
app.disable('x-powered-by')
/**
 * Cross Origin Resource Sharing Options
 * Allows request from any origin 
 */
 const corsOption = {
    origin : '*',
    credentials : true
}

/**
 * Apply the cors middleware to the express app
 */
 app.use(cors(corsOption))
/**
 * Initialize the GraphQL Server
 * 
 * GraphQL server handles all the requests for data
 * 
 * GraphQL server is loaded as a middleware on the express app, 
 * it is not being used as a standalone server in this application
 * 
 * Initializing with the schema that was generated in above code
 * For every graphql request we are extracting the authentication token
 * from the request headers and attaching it to the graphql context.
 * Token information is read from context in the resolvers
 * 
 */

 const graphqlServer = new ApolloServer({ schema,
    context : ({ req }) => {
        const token = req.headers.authorization || ''
        return { token }
    },
    introspection : process.env.NODE_ENV === "production"? false : true,
    playground : process.env.NODE_ENV === "production" ? false : true
})
   

/**
 * GraphQL server is added as a middleware to the existing express app
 */
graphqlServer.applyMiddleware({ app })

/**
 * Express app is configured to listen at port 4200
 */
app.listen({ port : 4200 }, ()=>console.log(`GraphQL Server is ready at http://localhost:4200${graphqlServer.graphqlPath}`))