'use strict';

module.exports = function  () {

  var utils  = require('./utils.js')();
  var R      = require('ramda');
  var append = R.append;

  var state  = { css: [] };

  var addCSS = function (filename, original, refactored) {
    state.css = append({
      filename: filename,
      original: original,
      refactored: refactored,
      compress: utils.getDataRateSave(refactored.length, original.length)
    }, state.css);
  };

  return {
    _state: state,
    addCSS: addCSS
  };
};