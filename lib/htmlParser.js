module.exports = function () {

  var utils = require('./utils.js');
  var cheerio = require('cheerio');

  var CLASS = /class=["']([a-zA-Z][a-zA-Z0-9-_][^'"]*)['"]/g;
  var NG_CLASS = /(?:ng-class|data-ng-class)=['"]{(.*)}['"]/g;

  utils.globalRamda();


  // var getRefactoredHTML = function (tolkensMap, htmlStr) {
  //   return compose()(htmlStr);
  // }


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


  return {
    getRefactoredHTML: getRefactoredHTML
  };
};