const dbConnect = require('./dbConnect');
var db = dbConnect.pool;

module.exports = function(payload, callback){

    db.getConnection((err, conn)=>{
        if(err){
            throw err;
        }
        console.log("Connection to dB established [transaction.js]");
        //MySQL transaction
        conn.beginTransaction((err)=>{
            if(err){
                throw err;
            }
    
            //withdraw funds from the sender
            var withdrawQuery = "UPDATE balances SET balance = balance - ? WHERE accountNr = ?";
            conn.query(withdrawQuery, [payload.amount, payload.sender], (err, row, fields)=>{
                if(err){
                    conn.rollback(()=>{
                        callback("ERROR: Transaction failed", null);
                        return;
                    });
                }
    
                //deposit funds into receiver account
                var depositQuery = "UPDATE balances SET balance = balance + ? WHERE accountNr = ?";
                conn.query(depositQuery, [payload.amount, payload.receiver], (err, row, fields)=>{
                    if(err){
                        conn.rollback(()=>{
                            callback("ERROR: Transaction failed", null);
                            return;
                        });
                    }
    
                    //recording transaction in the transactions table
                    var recordQuery = "INSERT INTO transactions (amount, accountNr) VALUES (?, ?)";
                    conn.query(recordQuery, [payload.amount, payload.sender], (err, row, fields)=>{
                        if(err){
                            conn.rollback(()=>{
                                callback("ERROR: Transaction failed", null);
                                return;
                            });
                        }
    
                        //commit transaction
                        conn.commit((err)=>{
                            if(err){
                                conn.rollback(()=>{
                                    callback("ERROR: Transaction failed", null);
                                    return;
                                });
                            }
                            console.log('Transaction Complete');
                            callback(null, true);
                            conn.release();  //release connection
                        });
                    });
                });
            });
        });        
    })
}