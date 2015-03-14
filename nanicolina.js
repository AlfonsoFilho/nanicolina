/* global */
'use strict';

module.exports = function () {

  var fs = require('fs');
  var path = require('path');
  var css = require('css');
  var cheerio = require('cheerio');

  var R = require('ramda');
  // Make Ramda available in global scope
  for(var fn in R){
    global[fn] = R[fn];
  }
  var length = R.length; // Fix lint error


  var ATTR = /(\S+)=["]?((?:.(?!["]?\s+(?:\S+)=|[>"]))+.)["]?/g;
  var CLASS_ATTR = /^class=/g;
  var ID_ATTR = /^id=/g;
  var NG_CLASS_ATTR = /^(ng-class|data-ng-class)=/g;
  var QUOTES_CONTENT = /"([^"]*)"/;
  var WHITESPACE = /\s+/g;
  var NG_CLASS_VALUES = /'([^']*)'/g;
  var CLASS = /\.([\w-]*)/g;

  var RADIX = 52;


  var getAttributesFromHTML = compose(
    match(ATTR),
    toLower);

  var getClassAttributes = filter(match(CLASS_ATTR));

  var getIdAttributes = filter(match(ID_ATTR));

  var getNgClassAttributes = filter(match(NG_CLASS_ATTR));

  var getAttrValue = function(str) { // TODO: Figure out a better solution, maybe regex is wrong
    return match(QUOTES_CONTENT, str)[1];
  };

  var getAttrValueList = split(WHITESPACE);

  var getNgClassValueList = compose(
    map(replace(/\'/g, '')), // TODO: Figure out a better solution, maybe regex is wrong
    match(NG_CLASS_VALUES));

  var toRadix = function (N, radix) {
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
  };

  var getObjectLength = compose(length, keys);

  var convert2Tolken = function (name, type, tolkens) {
    var obj = {};
    var prefix = type === 'class' ? '.' : '#';
    obj[prefix + name] = toRadix(getObjectLength(tolkens), RADIX);
    return obj;
  };

  var addTolken = function (name, type, tolkens) {
    return merge(convert2Tolken(name, type, tolkens), tolkens);
  };

  var getClass = compose(
    flatten,
    filter(not(isNil)),
    map(match(CLASS))
  );

  var getClassFromMedia = compose(
    ifElse(
      propEq('type', 'media'),
        prop('rules'),
        I
    )
  );

  var removeDuplicate = function (acc, value) {

    var hasInAcc = curry(function (value, acc) {
      return find(function (item) {
        return item === value;
      }, acc);
    });

    return compose(
      ifElse(
        hasInAcc(value),
          I,
          append(value)
      )
    )(acc);
  };

  var getClassesFromCSS = compose(
    map(replace(CLASS, '$1')),
    reduce(removeDuplicate, []),
    flatten,
    map(getClass),
    map(prop('selectors')),
    filter(propEq('type', 'rule')),
    flatten,
    map(getClassFromMedia),
    prop('rules'),
    prop('stylesheet'),
    css.parse
  );

  var getTolkensMap = function (tolkensMap, cssStr) {
    var classes = getClassesFromCSS(cssStr);
    var _tolkensMap = _tolkensMap || {};

    forEach(function (item) {
      _tolkensMap = addTolken(item, 'class', _tolkensMap);
    }, classes);

    return _tolkensMap;
  };

  var getRefactoredCSS = function(tolkensMap, cssStr){

    var tolkensKeys = keys(tolkensMap);
    var tolkensValues = values(tolkensMap);

    forEachIndexed(function (item, index) {
      cssStr = replace(new RegExp('(\\' + item + ')([\.\[>:,{ ])', 'g'), '.' + tolkensValues[index] + '$2', cssStr);
    }, tolkensKeys);

    return cssStr;
  };

  var getRefactoredHTML = function (tolkensMap, htmlStr) {

    var $ = cheerio.load(htmlStr, {decodeEntities: false});

    var tolkensKeys = keys(tolkensMap);
    var tolkensValues = values(tolkensMap);

    forEachIndexed(function (item, index) {

      var $item = $(item);
      var itemNameOnly = item.replace('.', '');
      var currentAttr = '';
      var nameRegEx = new RegExp('[\'"\s](' + itemNameOnly + ')[\s\'"]', 'g');

      if($item.length > 0){
        $item.toggleClass(item.replace('.', '') + ' ' + tolkensValues[index]);
      }

      $item = $('[data-ng-class*=\'' + itemNameOnly + '\'], [ng-class*=\'' + itemNameOnly + '\']');


      if($item.length > 0){
        if($item.attr('ng-class')){
          currentAttr = $item.attr('ng-class');
          $item.attr('ng-class', currentAttr.replace(nameRegEx, '\'' + tolkensValues[index] + '\''));
        } else {
          currentAttr = $item.attr('data-ng-class');
          $item.attr('data-ng-class', currentAttr.replace(nameRegEx, '\'' + tolkensValues[index] + '\''));
        }
      }
    }, tolkensKeys);

    return $.html();
  };

  var rename = function (options) {

    var result = {};
    var tolkensMap = {};
    var css = options.css || false;
    var html = options.html || false;


    if(css){
      result.css = [];
      result.css = map(function (item) {
        tolkensMap = getTolkensMap(tolkensMap || {}, item);
        return getRefactoredCSS(tolkensMap, item);
      }, css);
    }

    if(html){
      result.html = [];
      result.html = map(function (item) {
        return getRefactoredHTML(tolkensMap, item);
      }, html);
    }

    // result.tolkensMap = tolkensMap;

    return result;

  };



  return {
    getAttributesFromHTML: getAttributesFromHTML,
    getClassAttributes: getClassAttributes,
    getIdAttributes: getIdAttributes,
    getNgClassAttributes: getNgClassAttributes,
    getAttrValue: getAttrValue,
    getAttrValueList: getAttrValueList,
    getNgClassValueList: getNgClassValueList,
    toRadix: toRadix,
    addTolken: addTolken,
    getClassesFromCSS: getClassesFromCSS,
    getRefactoredCSS: getRefactoredCSS,
    getTolkensMap: getTolkensMap,
    getRefactoredHTML: getRefactoredHTML,
    rename: rename
  };

};
