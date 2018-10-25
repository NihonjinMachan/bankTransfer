const mysql = require('mysql2');
const express = require('express');
const app = express();

app.use(express.static('./public'));

app.get('/', function (req, res) {
    res.sendFile('/public/index.html');
});

// POST /transfer {from:1, to:2, amount:25}
app.post('/transfer', function (req, res) {
    //your code here
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
})

app.listen(3000, function () {
    console.log(`Listening on port 3000!`);
});
