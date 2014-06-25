var car = {
  details : {brand:'toyota'},
  wheels: function(num){return num}
}
iEye = {
  car:car
}

iEye.checkInterpolation = function(text, scope) {
  var errors =[];
  var parts = iEye.getParts(text);
  parts.forEach(function(operand) {
    var opParts =  operand.split('.');
    var result = iEye.checkExsistance(iEye, opParts[0], opParts, 0, "");
    if(result){
      iEye.displayResults(result, text);
    }
  })
}

iEye.getParts = function(str) {
  return str.split(/[^a-zA-Z_.]/).filter(function(x){return x;});
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
iEye.checkInterpolation('{{car.detail.brand+car.details.brand+car.wheels("4")/2}}')
// console.log();