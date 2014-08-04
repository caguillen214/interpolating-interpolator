var suggest = require('suggest-it');

module.exports = function(allParts, originalInterpolation, scope) {
  var suggestion, partToSend, found = false;

  allParts.forEach(function(part) {
    if(!scope.$eval(part) && !found){
      found = true;
      var perInd = part.lastIndexOf('.'),
        tempScope = (perInd > -1) ? scope.$eval(part.substring(0, perInd)) : scope,
        tempPart = part.substring(part.lastIndexOf('.') + 1),
        dictionary = Object.keys(tempScope);
      suggestion = suggest(dictionary)(tempPart);
      partToSend = part;
    }
  });

  return [suggestion, partToSend];
};
