const express = require('express');
const db = require('./custom_modules/dbConnect');
const bodyParser = require('body-parser');
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
    var queryString = "SELECT balance FROM balances WHERE accountNr = ?";
    db.connection.query(queryString, [req.body.sender], (err, rows, fields)=>{
        if(err){ 
            console.log("Query Error");
            res.sendStatus(500);  //internal server error
        }
        res.json(rows);
    });
    /*
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
