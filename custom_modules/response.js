module.exports = function(payload, db, callback){

    //final response object
    var response = {};
    var counter = 0; //keep track of finished select statements

    db.getConnection((err, conn)=>{
        if(err){
            throw err;
        }
        console.log("Connection to dB established [response.js]");
        //retrieving the latest transaction reference ID
        var transactionReferenceQuery = "SELECT reference FROM transactions WHERE accountNr = ? ORDER BY reference DESC LIMIT 1";
        conn.query(transactionReferenceQuery, [payload.sender], (err, rows, fields)=>{
            if(err){
                callback("ERROR: Query Error (transactionReferenceQuery)", null);
                return;
            }
            response['reference'] = rows[0].reference;
            counter++;
        });

        //retrieving the new balance in the sender's account
        var newSenderBalanceQuery = "SELECT balance FROM balances WHERE accountNr = ?";
        conn.query(newSenderBalanceQuery, [payload.sender], (err, rows, fields)=>{
            if(err){
                callback("ERROR: Query Error (newSenderBalanceQuery)", null);
                return;
            }
            response['senderBalance'] = rows[0].balance;
            counter++;
        });

        //retrieving the new balance in the receiver's account
        var newReceiverBalanceQuery = "SELECT balance FROM balances WHERE accountNr = ?";
        conn.query(newReceiverBalanceQuery, [payload.receiver], (err, rows, fields)=>{
            if(err){
                callback("ERROR: Query Error (newReceiverBalanceQuery)", null);
                return;
            }
            response['receiverBalance'] = rows[0].balance;
            counter++;
            
            if(counter === 3){
                conn.release();
                callback(null, response);
            }  
        });  
    });
}