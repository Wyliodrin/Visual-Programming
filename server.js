"use strict"
var express=require('express');
var app=express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
//var session = require('express-session');

//app.use(session({secret:'shhh'}));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use("/html",express.static(path.join(__dirname, 'public/html')));
require('./routes/index')(app);

var port;
var obj = fs.readFileSync('conf/settings.json', 'utf-8');
if(obj)
{
	var settings = JSON.parse(obj);
	if(settings.port)
		port = settings.port;
	else
		port = 3000;
}
else
{
	port = 3000;
}

var server=app.listen(port,function(){
    console.log("We have started our server on port "+port);
});