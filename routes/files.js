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
	if(verifyFileLocation(folderName))
		removeRecursive(folderName, callbackFunction);
	else
		callbackFunction(new Error('wrong project'));
}

function removeRecursive(path, callbackFunction)
{
	var details = { 'path' : path};

	fs.stat(path, function(err, stats) {
      if(err){
        callbackFunction(err,stats);
        return;
      }

      var isFile = stats.isFile();
      var isDirectory = stats.isDirectory();
      details.isFile = isFile;
      details.isDirectory = isDirectory;

      if(isFile){
        fs.unlink(path, function(err) {
          if(err) {
            callbackFunction(err);
          }else{
            callbackFunction(null);
          }
          return;
        });
      }else if(isDirectory){
        // A folder may contain files
        // We need to delete the files first
        // When all are deleted we could delete the 
        // dir itself
        fs.readdir(path, function(err, files) {
          if(err){
            callbackFunctionb(err);
            return;
          }
          var f_length = files.length;
          var f_delete_index = 0;
 
          // Check and keep track of deleted files
          // Delete the folder itself when the files are deleted
 
          var checkStatus = function(){
            // We check the status
            // and count till we r done
            if(f_length===f_delete_index){
              fs.rmdir(path, function(err) {
                if(err){
                  callbackFunction(err);
                }else{ 
                  callbackFunction(null);
                }
              });
              return true;
            }
            return false;
          };

          if(!checkStatus()){
          	details.checkStatus = false;
			for(var i=0;i<f_length;i++){
              // Create a local scope for filePath
              // Not really needed, but just good practice
              // (as strings arn't passed by reference)
              (function(){
                var filePath = path + '/' + files[i];
                // Add a named function as callback
                // just to enlighten debugging
                removeRecursive(filePath,function removeRecursiveCB(err,status){
                  if(!err){
                    f_delete_index ++;
                    checkStatus();
                  }else{
                    callbackFunction(err,null);
                    return;
                  }
                });
    
              })()
            }
          }
        });
      }
    });
}


function getApplications(callbackFunction)
{
	//TODO -verificat ca e director
	fs.readdir(dir, callbackFunction);
}

exports.getApplications = getApplications;
exports.createProjectFolder = createProjectFolder;
exports.removeProjectFolder = removeProjectFolder;


