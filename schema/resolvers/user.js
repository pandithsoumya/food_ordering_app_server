
const crypto = require('crypto')
const { ApolloError, ForbiddenError, UserInputError, AuthenticationError } = require('apollo-server-express')
const { mysqlQuery } = require('../../config/mysql')
const { verifyToken, reIssueToken, generateToken } = require('../../config/jwt')
const { getTimeDuration } = require('../../helperFunctions')

const sha1 = (data) => (crypto.createHash("sha1").update(data, "binary").digest("hex"))

const formatUser = (data) => {
    return {
        userID : data.id,
        userName : data.username,
        email : data.email,
        role : data.role,
        lastActive :getTimeDuration(data.last_active),
        lastLogin : getTimeDuration(data.last_login),
        isActive : data.is_active
    }
}

module.exports = {

    Query: {
       
        async loginUser(_, args, context) {

            return new Promise(async (resolve, reject) => {

                const { email, password } = args.input

                const passwordHash = sha1(password)
                
               
                
               
                try {

                    /**
                     * Check if the provided credentials is valid
                     */
                   
                    const searchQuery = `SELECT id, username, email,role, last_login, last_active, is_active FROM user_table WHERE email=? AND password=? AND is_active=1`
                    const searchParams = [email, passwordHash]
                    const searchResult = await mysqlQuery(searchQuery, searchParams)
                   
                    if (searchResult.length > 0) {

                        /**
                         * Generate the JWT token on successfull authentication
                         */

                        const token = await generateToken({
                            userID: searchResult[0].id,
                            userName: searchResult[0].username,
                            email: searchResult[0].email,
                            role: searchResult[0].role,
                            lastLogin: searchResult[0].last_login,
                            lastActive: searchResult[0].last_active
                        })

                        /**
                         * Update the last login time
                         */
                        const updateLastLogin = await mysqlQuery(`UPDATE user_table SET last_login=CURRENT_TIMESTAMP(), last_active=CURRENT_TIMESTAMP() WHERE id=${searchResult[0].id}`)
                     
                        resolve(token)

                    }
                    else {

                        /**
                         * 
                         * No Match for the given credentials
                         * 
                         * Invalid Credentials
                         */
                        resolve(new AuthenticationError('Invalid Credentials'))

                    }

                } catch (error) {
                    resolve(new ApolloError(error))
                }

            })

        },
        async validateUser(_, args, context) {
            if (!context.token) {
                return new AuthenticationError('Invalid Token')
            } else {
                return new Promise(async (resolve, reject) => {

                    let decoded = null

                    try {

                        decoded = await verifyToken(context.token)

                    } catch (error) {

                        resolve(new ForbiddenError('Unauthorized Access'))

                    }

                    /**
                     * Check if the token is blacklisted
                     */
                    try {

                        const results = await mysqlQuery(`SELECT * FROM token_blacklist_table WHERE jwt_token='${context.token}'`)
                        if (results.length > 0) {
                            resolve(new AuthenticationError('Invalid Token'))
                        }

                    } catch (error) {
                        resolve(new ApolloError(error))
                    }

                    /**
                     * Incase the token is valid and it is not blacklisted
                     * issue a new token with a new expiry
                     */
                    try {

                        const token = await reIssueToken(context.token)
                        resolve(token)
                        

                    } catch (error) {
                        resolve(new ApolloError(error))
                    }

                })

            }
        }

    },

    Mutation: {

        async registerUser(_,args,context){

            return new Promise(async (resolve,reject) => {

                const { email, password } = args.input
                
                const emailRegex = new RegExp(/[a-z|A-Z|0-9.]+@gmail.com/g)
                if(!emailRegex.test(email)){
                    resolve(new UserInputError('Invalid Email ID'))
                }

                const username = email.split('@')[0]
                const passwordHash = sha1(password)
                const role = "user" 

                /**Insert the information into the database */
                const insertSQL = `INSERT INTO user_table (username, email, password, role, is_active) VALUES (?)`
                const params = [[username, email, passwordHash, role, 1]]

                try {
                    
                    const insertResult = await mysqlQuery(insertSQL,params)
                    const userData = await mysqlQuery(`SELECT id, username, email, role, last_active, last_login, is_active FROM user_table WHERE id=${insertResult.insertId}`)

                    const obj = formatUser(userData[0])

                    resolve(obj)

                } catch (error) {

                    resolve(new ApolloError(error))

                }

            })
        },

        async logoutUser(_, args, context) {
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
                         * Add the token to the list of blacklisted tokens
                         */
                        const insert = await mysqlQuery(`INSERT INTO token_blacklist_table(jwt_token) VALUES('${context.token}')`)
                        resolve(true)

                    } catch (error) {
                        resolve(new ApolloError(error))
                    }

                })

            }
        },

       

    }
}

