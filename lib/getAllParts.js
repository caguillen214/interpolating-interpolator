var getInterpolation = require('./getInterpolation');
var getOperands = require('./getOperands');
var concatParts = require('./concatParts');

module.exports = function(text, startSym, endSym) {
  var comboParts = [];
  var interpolation = getInterpolation(text, startSym, endSym);
  var operands = getOperands(interpolation);
  operands.forEach(function(operand) {
    var opParts =  operand.split('.');
    for(var i = 0; i < opParts.length; i++) {
      var result = concatParts(opParts,i);
      if(result && comboParts.indexOf(result) < 0 && isNaN(+result)){
        comboParts.push(result);
      }
    }
  });
  return comboParts;
};
