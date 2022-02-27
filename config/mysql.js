/**
 * 
 * MySQL Config and Functions file
 * 
 * Author : Soumya Pandith U
 * 
 * File contains the helper functions required for the db operations executed by this tool
 * 
 */
 const mysql = require('mysql')

 const CREDENTIALS = {
     host : '127.0.0.1',
     user : 'root',
     password : '',
     database : 'food_ordering_app'
 
 }
 
 const Query = async (query, params) => {
     return new Promise((resolve,reject) => {
 
         /**
          * Open connection to the database
          */
         const dbConnection = mysql.createConnection(CREDENTIALS)
 
         if(params === null){
 
             /**
              * 
              * Use case when the query does not contain any parameters that need to be escaped
              * 
              * 
              */
 
             const sqlQuery = dbConnection.query(query, (err,results) => {
 
                 //console.log(sqlQuery.sql)
 
                 /**
                  * Close the db connection after executing the query
                  */
                 dbConnection.end()
 
                 if(err){
 
                     /**
                      * Any errors encountered during the execution of the query will be sent to the calling location
                      * 
                      * Reject the error in the promise. It would be caught by the try catch statement
                      * 
                      */
                     reject(err)
 
                 }
                 else{
 
                     /**
                      * Return the results array back to the calling location
                      */
                     resolve(results)
 
                 }
 
             })
 
 
         }
         else{
 
             /**
              * 
              * Usecase when the query contains input paramters which need to be escaped
              * 
              * Any params passed separately to the mysql client are escaped before being used in the query
              * 
              */
 
              const sqlQuery = dbConnection.query(query, params, (err, results) => {
 
                 //console.log(sqlQuery.sql)
 
                  /**
                   * Close the db connection after executing the query
                   */
                  dbConnection.end()
 
                  if (err) {
 
                      /**
                       * Any errors encountered during the execution of the query will be sent to the calling location
                       * 
                       * Reject the error in the promise. It would be caught by the try catch statement
                       * 
                       */
                      reject(err)
 
                  } else {
 
                      /**
                       * Return the results array back to the calling location
                       */
                      resolve(results)
 
                  }
 
              })
 
         }
 
     })
 }
 
 module.exports = {
     credentials : CREDENTIALS,
     mysqlQuery : Query
 }