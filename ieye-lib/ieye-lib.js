var iEye = {};

iEye.getAllParts = function(text, startSym, endSym) {
  if(text.indexOf(startSym) < 0 || text.indexOf(endSym) < 0) {
    throw new Error('Missing start or end symbol in interpolation. Start symbol: "'+startSym+
      '" End symbol: "'+endSym+'"');
  }
  var comboParts = [];
  var interpolation = iEye.getInterpolation(text, startSym, endSym);
  var operands = iEye.getOperands(interpolation);
  operands.forEach(function(operand) {
    var opParts =  operand.split('.');
    for(var i = 0; i < opParts.length; i++) {
      var result = iEye.concatParts(opParts,i);
      if(result && comboParts.indexOf(result) < 0 && isNaN(+result)){
        comboParts.push(result);
      }
    }
  })
  return comboParts;
}

iEye.getInterpolation = function(text, startSym, endSym) {
  var startInd = text.indexOf(startSym) + startSym.length;
  var endInd = text.indexOf(endSym);
  return text.substring(startInd, endInd);
}

iEye.getOperands = function(str) {
  return str.split(/[\+\-\/\|\<\>\^=&!%~]/g);
}

iEye.checkExsistance = function(base, next, parts, i, result) {
  base = base[next];
  if(!base) {
    return iEye.concatParts(parts, i);
  }
  if(i != parts.length-1 && base) {
    result = iEye.checkExsistance(base,parts[++i], parts, i, result);
  }
  return result;
}

iEye.concatParts = function(parts,concatLength) {
  var total = '';
  for(var i = 0; i <= concatLength; i++) {
    var period = (i==0)?'':'.';
    total+=period+parts[i].trim();
  }
  return total;
}
