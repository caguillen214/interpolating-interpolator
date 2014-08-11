module.exports = function(str) {
  str = removeStringFromQuotes(str, "'");
  str = removeStringFromQuotes(str, '"');
  return str.replace(/[()]/g,' ').split(/[\+\-\/\|<\>\^=&!%~]/g);
};

function removeStringFromQuotes(str, quoteType) {
  var str1 =  str.substring(0, str.indexOf(quoteType));
  var str2 = str.substring(str.indexOf(quoteType, str.indexOf(quoteType)+1)+1);
  return (str).indexOf(quoteType) === - 1 ?  str : removeStringFromQuotes(str1 + str2, quoteType);
}