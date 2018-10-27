module.exports = function(payload, db, callback){

    //check if all necessary fields are present
    if(!payload.sender.trim() || !payload.receiver.trim() || !payload.amount){ //trim to remove white spaces
        callback("ERROR: Necessary fields not provided", null);
        return;
    }

    //check if account numbers is of length 8  
    if(payload.sender.length !== 8 && !payload.receiver.length !== 8){
        callback("ERROR: Invalid account number (Enter 8 character value)", null);
        return;
    }

    //check if account numbers follows the pattern (AA######)
    var regex = /^[A-Z]{2}\d{6}$/
    if(!regex.test(payload.sender) && !regex.test(payload.receiver)){
        callback("ERROR: Invalid account number (Pattern mismatch)", null);
        return;
    }

    //check if the amount to be transferred is available in the sender's account
    var checkAccountQuery = "SELECT * FROM `balances` WHERE accountNr = ? OR accountNr = ?"
    var queryString = "SELECT balance FROM balances WHERE accountNr = ?";
    var balance;
    db.getConnection((err, conn)=>{
        if(err){
            callback("ERROR: Internal server error (Connection error)", null);
            return;
        }
        else{
            console.log("Connection to dB established [validate.js]");
            conn.query(checkAccountQuery, [payload.sender, payload.receiver], (err, rows, fields)=>{
                if(err){
                    callback("ERROR: Internal server error (Query error)", null);
                    return;
                }
                if(!(rows.length === 2)){
                    callback("ERROR: Invalid account/s", null);
                    return;
                }
                else{
                    conn.query(queryString, [payload.sender], (err, rows, fields)=>{
                        if(err){
                            callback("ERROR: Internal server error (Query error)", null);
                            return;
                        }
                        balance = rows[0].balance;
                        if(!(balance > payload.amount)){
                            conn.release();
                            callback("ERROR: Account must have enough funds to make the transfer", null);
                        }
                        else{
                            conn.release();
                            callback(null, true);
                        }
                    });
                }
            });
        }
    });
}