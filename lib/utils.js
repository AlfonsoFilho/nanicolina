module.exports = function  () {

  var fs = require('fs');
  var path = require('path');
  var R = require('ramda');
  var Q = require('q');


  var getObjectLength = R.compose(R.length, R.keys);

  var log = R.curry(function (message, value) {
    console.log(message, value);
    return value;
  });

  function globalRamda () {
    // Make Ramda available in global scope
    for(var fn in R){
      global[fn] = R[fn];
    }
    var length = R.length; // Fix lint error
  }

  function removeDir(dirPath) {
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
  }

  function toRadix(N, radix) {
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
  }

  function readFile(file) {
    return Q.nfcall(fs.readFile, path.resolve(file), {encoding: 'utf8'});
  }

  function getDataRateSave(compressedData, unCompressedData) {
    return (1 - (compressedData/unCompressedData));
  }

  var createDir = R.tap(
      R.compose(
        R.reduce(function (acc, item) {
          acc = R.append(item, acc);
          try{
            fs.mkdirSync(path.join.apply(null, acc));
          } catch(e) {}
          return acc;
        }, []),
        R.split(path.sep),
        R.curry(path.relative)('.'),
        R.prop('dir')));

  var createFile = function (filePath, content) {
    return R.composeP(
      function (_path) {
        return Q.nfcall(fs.writeFile, path.format(_path), content);
      },
      createDir,
      path.parse)(filePath);
  };

  return {
    globalRamda: globalRamda,
    removeDir: removeDir,
    toRadix: toRadix,
    getObjectLength: getObjectLength,
    log: log,
    readFile: readFile,
    getDataRateSave: getDataRateSave,
    createDir: createDir,
    createFile: createFile
  };
};