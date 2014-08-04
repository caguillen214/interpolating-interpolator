var hintLog = angular.hint = require('angular-hint-log');

var partsEvaluate = require('./partsEvaluate');

module.exports = function(allParts, originalInterpolation, scope) {
  var res = partsEvaluate(allParts, originalInterpolation, scope);
  if(res[1]) {
    suggestion = (res[0]) ? ' Try: "'+res[0]+'"' : '';
    var part = res[1];
    var message = '"'+part+'" was found to be undefined in "'+originalInterpolation+'".'+ suggestion;
    hintLog.logMessage('##Interpolation## '+message);
  }
};
