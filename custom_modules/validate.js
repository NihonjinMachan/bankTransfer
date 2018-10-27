module.exports = function(payload, dbConnect, callback){

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
    var queryString = "SELECT balance FROM balances WHERE accountNr = ?";
    var balance;
    dbConnect.connection.query(queryString, [payload.sender], (err, rows, fields)=>{
        if(err){
            callback("ERROR: Internal server error (Query error)", null);
            return;
        }
        balance = rows[0].balance;
        if(!(balance > payload.amount)){
            callback("ERROR: Account must have enough funds to make the transfer", null);
            return;
        }
        else{
            callback(null, true);
            return;
        }
    });
}