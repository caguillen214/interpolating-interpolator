module.exports = function (part, scope) {
  var min_levDist = Infinity, closestMatch = '';
  for(var i in scope) {
    if(iiLib.areSimilarEnough(part, i)) {
      var currentlevDist = iiLib.levenshtein(part, i);
      closestMatch = (currentlevDist < min_levDist)? i : closestMatch;
      min_levDist = (currentlevDist < min_levDist)? currentlevDist : min_levDist;
    }
  }
  return closestMatch;
};