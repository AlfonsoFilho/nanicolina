'use strict';

var fs = require('fs');
var path = require('path');

function removeDir(dirPath) {
  var files;

  try {
    if (!fs.statSync(dirPath).isDirectory()) {
      return false;
    }
  } catch (e) {
    return false;
  }

  function readDirFiles(_dirPath) {
    try {
      return fs.readdirSync(_dirPath);
    } catch (e) {
      return false;
    }
  }

  files = readDirFiles(dirPath);

  if (files.length > 0) {

    var filePath;

    for (var i = 0; i < files.length; i++) {
      filePath = path.join(dirPath, files[i]);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        var subfiles = readDirFiles(filePath);
        if (subfiles) {
          removeDir(filePath);
        } else {
          fs.rmdirSync(filePath);
        }

      }
    }
    fs.rmdirSync(dirPath);
  } else {
    fs.rmdirSync(dirPath);
  }

  return true;
}

module.exports = {
  removeDir: removeDir
};
