var suggest = require('suggest-it');

module.exports = function(allParts, originalInterpolation, scope) {
  var suggestion, partToSend, found = false;
  var ngRepeatVarsHash = {
    '$index': true,
    '$first': true,
    '$last': true,
    '$middle': true,
    '$even': true,
    '$odd': true
  };

  allParts.forEach(function(part) {
    if(part.charAt(0) !== '.' && (!scope.$eval(part) || !ngRepeatVarsHash[part]) && !found){
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
