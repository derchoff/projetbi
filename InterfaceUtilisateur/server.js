var express = require('express');
var app = express();

app.use(express.static('national_dashboard'));
app.use(express.static('common'));


app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("projet BI - DARTIES listening at http://%s:%s", host, port)
})