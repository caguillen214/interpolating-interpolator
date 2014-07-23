var getSuggestion = require('./getSuggestion');

module.exports = function(allParts, originalInterpolation, scope) {
  var message, found = false;
  allParts.forEach(function(part) {
    if(!scope.$eval(part) && !found){
      found = true;
      var tempScope = scope.$eval(part.substring(0, part.lastIndexOf('.')));
      var tempPart = part.substring(part.lastIndexOf('.') + 1);
      var suggestion = getSuggestion(tempPart, tempScope);
      suggestion = (suggestion) ? ' Try: "'+suggestion+'"' : '';
      message = '"'+part+'" was found to be undefined in "'+originalInterpolation+'".'+ suggestion;
    }
  });
  return message;
};
