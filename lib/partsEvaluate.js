var suggest = require('suggest-it');

module.exports = function(allParts, originalInterpolation, scope) {
  var message, suggestion, partToSend, found = false;

  allParts.forEach(function(part) {
    if(!scope.$eval(part) && !found){
      found = true;
      var perInd = part.lastIndexOf('.');
      var tempScope = (perInd > -1) ? scope.$eval(part.substring(0, perInd)) : scope;
      var tempPart = part.substring(part.lastIndexOf('.') + 1);
      var dictionary = Object.keys(tempScope);
      suggestion = suggest(dictionary)(tempPart);
      partToSend = part;
    }
  });

  return [suggestion, partToSend];
};
