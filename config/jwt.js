/**
 * JWT Config and Functions file
 * 
 * Author :Soumya Pandith U
 * 
 * File contains the secret key that is used to generate the json web token and the functions to create/validate jwt
 * 
 */

 const jwt = require('jsonwebtoken')

 const SECRET = "A5471D8C85ABD46DBCB8B2DDEC403C440D320B84AB34D4B04E5395726583D7B4AF6A79699FE055ACACF673524B3ADEF85070E2F7A343D76D62EDC2568F452D91"
 
 const generateToken = async (data) => {
 
     return new Promise((resolve,reject)=>{
 
         const { userID, userName, email, role } = data
         let token = null
 
         /**
          * Check if we have all the required information
          * 
          * Project name value is optional, could be null
          */
         if(userID === null || userName === null || email === null || role === null ){
 
             reject('Incomplete data, please provide the full data')
 
         }
         else{
 
             /**
              * Sign the token with the provided data
              */
             token = jwt.sign({
                 userID : userID,
                 userName : userName,
                 email : email,
                 role : role,
                 exp : Math.floor(Date.now() /1000 ) + ( 60 * 60 * 24 ) // Expiry time set to 30 mins from time of generation
             },SECRET)
 
             resolve(token)
 
         }
 
     })
 
 }
 
 const verifyToken = async (token) => {
 
     return new Promise((resolve,reject) => {
 
         if(!token){
 
             reject('No token provided')
 
         }
         else{
 
             jwt.verify(token,SECRET,(err,decoded) => {
 
                 if(err){
                     reject(err)
                 }
                 else{
                     resolve(decoded)
                 }
 
             })
 
         }
 
     })
 
 }
 
 const reIssueToken = async (oldToken) => {
 
     return new Promise((resolve,reject) => {
 
         if(!oldToken){
             reject('No Token Provided')
         }
         else{
 
             /**
              * Verify if existing token is valid
              */
             jwt.verify(oldToken,SECRET,(err,decoded) => {
 
                 if(err){
 
                     reject('Invalid Token')
 
                 }
                 else{
                     
                     const token = jwt.sign({...decoded, exp : Math.floor(Date.now() / 1000) + (60 * 60 * 24)}, SECRET)
                     
                     resolve(token)
 
                 }
 
             })
 
         }
 
     })
 
 }
 
 module.exports =  {
     secret: SECRET,
     generateToken : generateToken,
     verifyToken : verifyToken,
     reIssueToken : reIssueToken
 }