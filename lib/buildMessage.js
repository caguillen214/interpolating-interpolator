var partsEvaluate = require('./partsEvaluate'),
  hintLog = angular.hint = require('angular-hint-log'),
  MODULE_NAME = 'Interpolation',
  SEVERITY_ERROR = 1;

module.exports = function(allParts, originalInterpolation, scope) {
  var res = partsEvaluate(allParts, originalInterpolation, scope);
  if(res[1]) {
    var suggestion = (res[0]) ? ' Try: "' + res[0] + '"' : '',
      part = res[1];
      message = '"' + part + '" was found to be undefined in "' + originalInterpolation + '".' +
        suggestion;
    hintLog.logMessage(MODULE_NAME, message, SEVERITY_ERROR);
  }
};
