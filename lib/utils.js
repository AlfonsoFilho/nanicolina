
var fs = require('fs');
var path = require('path');
var css = require('css');
var cheerio = require('cheerio');
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

  readFile: function (file) {
    return fs.readFileSync(path.resolve(file), {encoding: 'utf8'});
  },

  writeFile: function (file, content) {
    mkdirp(path.dirname(file), function (err) {
      if (err) {
        return console.log('ERROR - File ' + file + 'not written: ', err);
      }
      fs.writeFileSync(path.resolve(file), content);
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