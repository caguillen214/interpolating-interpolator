module.exports = function(allParts, originalInterpolation, scope, $timeout) {
  var message = iiLib.partsEvaluate(allParts, originalInterpolation, scope);
  if(message && iiLib.ngHintInterpMessages.indexOf(message) < 0) {
    iiLib.ngHintInterpMessages.push(message);
    iiLib.ngHintInterpMessages.push(scope.$parent);
    iiLib.delayDisplay(iiLib.ngHintInterpMessages, $timeout);
  }
};
