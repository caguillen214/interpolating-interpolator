var car = {
  details : {brand:'toyota'},
  wheels: function(num){return num}
}
iEye = {
  car:car
}

iEye.getAllParts = function(text, startSym, endSym) {
  var comboParts = [];
  var interpolation = iEye.getInterpolation(text, startSym, endSym);
  var operands = iEye.getOperands(interpolation);
  operands.forEach(function(operand) {
    var opParts =  operand.split('.');
    for(var i = 0; i < opParts.length; i++) {
      var result = iEye.concatParts(`opParts,i);
      if(result && comboParts.indexOf(result) < 0){
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
  return str.match(/([a-zA-Z_.]+(\[.+])*)/g);
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
    total+=period+parts[i];
  }
  return total;
}

iEye.displayResults = function(result, interpolation) {
  console.log(result+ ' was found to be undefined in '+interpolation);
}