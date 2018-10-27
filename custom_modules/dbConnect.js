const mysql = require('mysql2');

//dB connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'exercise'
});

/*
//connection check to make sure database is available
connection.connect((err)=>{
    if(err){
        throw err;
    } 
    console.log("Connection successful");  
});
*/

module.exports = {pool}  