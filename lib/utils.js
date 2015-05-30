var fs = require('fs');
var path = require('path');
var R = require('ramda');
var mkdirp = require("mkdirp");

module.exports = {

  globalRamda: function () {
    // Make Ramda available in global scope
    for(var fn in R){
      global[fn] = R[fn];
    }
    var length = R.length; // Fix lint error
  },

  removeDir: function (dirPath) {
    var files;

    try {
      if(!fs.statSync(dirPath).isDirectory()){
        return false;
      }
    } catch(e) {
      return false;
    }

    function readDirFiles(_dirPath){
      try {
        return fs.readdirSync(_dirPath);
      } catch(e) {
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
          if(subfiles){
            this.removeDir(filePath);
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
  },

  readFile: function (file) {
    return fs.readFileSync(path.resolve(file), {encoding: 'utf8'});
  },

  writeFile: function (file, content, cb) {
    mkdirp(path.dirname(file), function (err) {
      if (err) {
        return console.log('ERROR - File ' + file + 'not written: ', err);
      }
      fs.writeFileSync(path.resolve(file), content);

      if(typeof(cb) === 'function'){
        cb();
      }
    });
  },

  toRadix: function (N, radix) {
    //http://www.javascripter.net/faq/convert3.htm?t1=toRadix%2810%2C25%29

    var HexN="",
        Q=Math.floor(Math.abs(N)),
        R;

    while (true) {
      R = Q % radix;
      HexN = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(R) + HexN;
      Q = ( Q - R ) / radix;
      if ( Q === 0 ) {
        break;
      }
    }

    return ((N<0) ? "-" + HexN : HexN);
  },

  getObjectLength: R.compose(R.length, R.keys),

  log: R.curry(function (message, value) {
    console.log(message, value);
    return value;
  })

};