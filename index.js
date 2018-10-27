const express = require('express');
const bodyParser = require('body-parser');
const validate = require('./custom_modules/validate');
const transaction = require('./custom_modules/transaction');
const response = require('./custom_modules/response');
const app = express();

//accessing static front-end files
app.use(express.static('./public'));

//parsing data sent in a POST request
app.use(bodyParser.urlencoded({extended : false}));

//load home page
app.get('/', function (req, res) {
    res.sendFile('/public/index.html');
});

// POST /transfer {sender:1, receiver:2, amount:25}
app.post('/transfer', function (req, res) {

    //data validation
    validate(req.body, (err, result)=>{
        if(err){
            res.send(`${err}. Please go back to homepage and try again.`);
        }
        else{
            //creating a white list for added security
            var transactionData = {
                sender: req.body.sender,
                receiver: req.body.receiver,
                amount: req.body.amount
            }

            //perform transaction
            transaction(transactionData, (err, result)=>{
                if(err){
                    res.send(`${err}`);
                }
                else{
                    //final response
                    response(transactionData, (err, result)=>{
                        if(err){
                            res.send(`${err}`);
                        }
                        res.send({
                            "id": result.reference,
                            "sender":{
                                "accountNr": transactionData.sender,
                                "New balance": result.senderBalance
                            },
                            "receiver":{
                                "accountNr": transactionData.receiver,
                                "New balance": result.receiverBalance                        
                            },
                            "transferAmount": transactionData.amount
                        });
                    });
                }
            });
        }
    });
});

app.listen(3000, function () {
    console.log(`Listening on port 3000!`);
});
