const { ApolloError, ForbiddenError, UserInputError, AuthenticationError } = require('apollo-server-express')
const { mysqlQuery } = require('../../config/mysql')
const { verifyToken } = require('../../config/jwt')

module.exports = {

    Query: {
       
        async getRestaurants(_, args, context) {

            if (!context.token) {
                return new AuthenticationError('Invalid Token')
            } 
            
            else {
                return new Promise(async (resolve, reject) => {

                    let decoded = null

                    try {

                        decoded = await verifyToken(context.token)

                    } catch (error) {

                        resolve(new ForbiddenError('Unauthorized Access'))

                    }


               
                try {

                    /**
                     * Check if the provided credentials is valid
                     */
                   
                    const query = `SELECT id, name, cuisine,cost, rating, delivery_time, image, place FROM restaurants_table`
                   
                    const results = await mysqlQuery(query)
                   
                    const dataArray = results.map(row => {

                        const obj = {
                            id : row.id,
                            name: row.name,
                            cuisine : row.cuisine,
                            cost : row.cost,
                            rating: row.rating,
                            delivery_time : row.delivery_time,
                            image : row.image,
                            place : row.place
                        }
                        return obj;
                    })
                   
                     
                    //  console.log(dataArray)

                    resolve(dataArray)
                  

                } catch (error) {
                    resolve(new ApolloError(error))
                }

            })
        }

        },
    }
}