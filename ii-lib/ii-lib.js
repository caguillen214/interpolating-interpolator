'use strict';
var iiLib = {
  currentPromises: {};
};

iiLib.getAllParts = function(text, startSym, endSym) {
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
  })
  return comboParts;
}

iiLib.getInterpolation = function(text, startSym, endSym) {
  var startInd = text.indexOf(startSym) + startSym.length;
  var endInd = text.indexOf(endSym);
  return text.substring(startInd, endInd);
}

iiLib.getOperands = function(str) {
  return str.split(/[\+\-\/\|\<\>\^=&!%~]/g);
}

iiLib.concatParts = function(parts,concatLength) {
  var total = '';
  for(var i = 0; i <= concatLength; i++) {
    var period = (i==0)?'':'.';
    total+=period+parts[i].trim();
  }
  return total;
}
iiLib.delayDisplay = function(messages) {
  $timeout.cancel(iiLib.currentPromises);
  iiLib.currentPromises = $timeout(function() {
    iiLib.displayMessages(messages);
  }.bind(this),250)
}
iiLib.displayMessages = function(messages){
  console.groupCollapsed('Angular Hint: Interpolation');
  for(var i = 0; i < messages.length; i+=2) {
    console.groupCollapsed(messages[i]);
    console.warn(messages[i+1]);
    console.groupEnd();
  }
  console.groupEnd();
}