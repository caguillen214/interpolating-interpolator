module.exports = function(text, startSym, endSym) {
  if(text.indexOf(startSym) < 0 || text.indexOf(endSym) < 0) {
    throw new Error('Missing start or end symbol in interpolation. Start symbol: "'+startSym+
      '" End symbol: "'+endSym+'"');
  }
  var comboParts = [];
  var interpolation = iiLib.getInterpolation(text, startSym, endSym);
  var operands = iiLib.getOperands(interpolation);
  operands.forEach(function(operand) {
    var opParts =  operand.split('.');
    for(var i = 0; i < opParts.length; i++) {
      var result = iiLib.concatParts(opParts,i);
      if(result && comboParts.indexOf(result) < 0 && isNaN(+result)){
        comboParts.push(result);
      }
    }
  });
  return comboParts;
};