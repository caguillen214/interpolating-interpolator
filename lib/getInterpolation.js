module.exports = function(text, startSym, endSym) {
  var startInd = text.indexOf(startSym) + startSym.length,
    endInd = text.indexOf(endSym);
  return text.substring(startInd, endInd);
};
