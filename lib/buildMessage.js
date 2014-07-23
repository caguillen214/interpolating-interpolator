var hintLog = require('angular-hint-log');

var partsEvaluate = require('./partsEvaluate');
var delayDisplay = require('./delayDisplay');

module.exports = function(allParts, originalInterpolation, scope, $timeout) {
  var message = partsEvaluate(allParts, originalInterpolation, scope);
  if(message) {
    hintLog.logMessage(message);
  }
};
