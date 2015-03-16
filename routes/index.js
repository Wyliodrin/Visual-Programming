"use strict"
var express = require('express');
var files = require('./files.js');
var _ = require('underscore');

//returns a list of the existing directories(applications)
function listApplications(req, res)
{
	files.getApplications(function(err, files){
		var response;
		if(!err)
			response = {'status':'done', 'applications':files};
		else
			response = {'status':'err', 'applications':null};
		res.status(200).send(response);
	});
}

function addApplication(req, res)
{
	var appName = req.body.name;
	files.createProjectFolder(appName, function(err, appName){
		var response;
		console.log(err);
		if(!err)
			response = {'status':'done', 'name':appName};
		else
			response = {'status':'err', 'name':null};
		res.status(200).send(response);
	});
}

function removeApplication(req, res)
{
	var appName = req.body.name;
	files.removeProjectFolder(appName, function(err){
		var response;
		if(!err)
			response = {'status':'done'};
		else
			response = {'status':'err'};
		res.status(200).send(response);
	});
}

module.exports = function(app)
{
	app.post('/applications', listApplications);
	app.post('/add_application', addApplication);
	app.post('/remove_application', removeApplication);
}
