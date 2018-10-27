const mysql = require('mysql2');

//dB connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'exercise'
});

module.exports = {pool}  