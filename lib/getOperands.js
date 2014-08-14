module.exports = function(str) {
  str = removeStringFromQuotes(str, "'");
  str = removeStringFromQuotes(str, '"');
  var pipeIndex = str.lastIndexOf('|');
  pipeIndex = str.charAt(pipeIndex - 1) === '|' ? str.length : pipeIndex;
  pipeIndex = pipeIndex < 0 ? str.length : pipeIndex;
  str = str.substring(0, pipeIndex);
  return str.replace(/[()]/g,'|')
    .split(/[\+\-\/\|<\>\^=&!%~]/g)
    .map(function(x){return x.trim()})
    .filter(function(x){return x.trim();});
};

function removeStringFromQuotes(str, quoteType) {
  var quoteInd = str.indexOf(quoteType);
  var str1 =  str.substring(0, quoteInd);
  var str2 = str.substring(str.indexOf(quoteType, quoteInd+1)+1);
  return quoteInd === - 1 ?  str : removeStringFromQuotes(str1 + str2, quoteType);
}