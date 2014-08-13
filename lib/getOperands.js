module.exports = function(str) {
  str = removeStringFromQuotes(str, "'");
  str = removeStringFromQuotes(str, '"');
  var pipeIndex = str.lastIndexOf(' | ');
  pipeIndex = pipeIndex < 0 ? str.length : pipeIndex;
  str = str.substring(0, pipeIndex);
  return str.replace(/[()]/g,'|')
    .split(/[\+\-\/\|<\>\^=&!%~]/g)
    .map(function(x){return x.trim()})
    .filter(function(x){return x.trim();});
};

function removeStringFromQuotes(str, quoteType) {
  var str1 =  str.substring(0, str.indexOf(quoteType));
  var str2 = str.substring(str.indexOf(quoteType, str.indexOf(quoteType)+1)+1);
  return (str).indexOf(quoteType) === - 1 ?  str : removeStringFromQuotes(str1 + str2, quoteType);
}