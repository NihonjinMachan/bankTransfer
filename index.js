const express = require('express');
const bodyParser = require('body-parser');
const db = require('./custom_modules/dbConnect');
const validate = require('./custom_modules/validate');
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
    validate(req.body, db, (err, result)=>{
        if(err){
            res.send(`${err}. Please go back to homepage and try again.`);
        }

        //creating a white list for added security
        var transactionData = {
            sender: req.body.sender,
            receiver: req.body.receiver,
            amount: req.body.amount
        }

        
    });
    /*
    var queryString = "SELECT balance FROM balances WHERE accountNr = ?";
    db.connection.query(queryString, [req.body.sender], (err, rows, fields)=>{
        if(err){ 
            console.log("Query Error");
            res.sendStatus(500);  //internal server error
        }
        res.json(rows);
    });
    res.send({
        "id":45,
        "from":{
            "id":1, "balance": 25
        },
        "to":{
            "id":2,"balance": 125
        },
        "transfered": 25
    });
    */
});

app.listen(3000, function () {
    console.log(`Listening on port 3000!`);
});
