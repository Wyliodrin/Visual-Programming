"use strict"

var DEFAULT_DIR = "/wyliodrin/applications"
var fs = require ('fs');
var path = require ('path');

var dir;
var obj = fs.readFileSync('conf/settings.json', 'utf-8');
if(obj)
{
	var settings = JSON.parse(obj);
	if(settings.files)
		dir = settings.files;
	else
		dir = DEFAULT_FILES;
}
else
{
	dir = DEFAULT_FILES;
}

function verifyFileLocation (filename)
{
	return (filename.indexOf (dir)==0);
}


function createProjectFolder (name, callbackFunction)
{
	var folderName = path.normalize (path.join (dir,name));
	if (verifyFileLocation(folderName))
	{
		fs.mkdir (folderName, function (err)
		{
			if (err != null)
			{
				callbackFunction(err, null);
			}
			else
			{
				callbackFunction(null, folderName);
			}
		});
	}
	else 
	{
		callbackFunction (new Error ('wrong project name'), null);
	}
}

function removeProjectFolder (name, callbackFunction)
{
	var folderName = path.normalize (path.join (dir,name));
	if (verifyFileLocation(folderName, dir))
	{
		fs.rmdir (folderName, function (err)
		{
			callbackFunction(err);
		});
	}
	else
		callbackFunction(new Error ('wrong project name'));
}


function getApplications(callbackFunction)
{
	//TODO -verificat ca e director
	fs.readdir(dir, callbackFunction);
}

exports.getApplications = getApplications;
exports.createProjectFolder = createProjectFolder;
exports.removeProjectFolder = removeProjectFolder;


