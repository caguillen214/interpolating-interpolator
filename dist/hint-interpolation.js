(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var iiLib = require('./ii-lib/ii-lib');

angular.module('ngHintInterpolation', [])
  .config(['$provide', function($provide) {
    var ngHintInterpMessages = [];
    $provide.decorator('$interpolate', ['$delegate', '$timeout', function($delegate, $timeout) {
      var interpolateWrapper = function() {
        var interpolationFn = $delegate.apply(this, arguments);
        if(interpolationFn) {
          var parts = iiLib.getAllParts(arguments[0],$delegate.startSymbol(),$delegate.endSymbol());
          var temp = interpolationFnWrap(interpolationFn,arguments, parts);
          return temp;
        }
      };
      var interpolationFnWrap = function(interpolationFn, interpolationArgs, allParts) {
        return function(){
          var result = interpolationFn.apply(this, arguments);
          iiLib.buildMessage(allParts, interpolationArgs[0].trim(), arguments[0], $timeout);
          return result;
        };
      };
      angular.extend(interpolateWrapper,$delegate);
      return interpolateWrapper;
    }]);
  }]);

},{"./ii-lib/ii-lib":2}],2:[function(require,module,exports){
(function (iiLib) {
'use strict';

var hintLog = require('angular-hint-log');
hintLog.moduleName = 'Interpolation';
hintLog.moduleDescription = '';
iiLib.errorNumber = 0;
iiLib.currentPromises = {};
iiLib.ngHintInterpMessages = [];

iiLib.getAllParts = require('../lib/getAllParts');

iiLib.getInterpolation = require('../lib/getInterpolation');

iiLib.getOperands = require('../lib/getOperands');

iiLib.concatParts = require('../lib/concatParts');

iiLib.delayDisplay = require('../lib/delayDisplay');

iiLib.displayMessages = require('../lib/displayMessages');

iiLib.partsEvaluate = require('../lib/partsEvaluate');

iiLib.buildMessage = require('../lib/buildMessage');

// iiLib.getCorrectScope = function(part, original, scope) {
//   if(scope[part] !== undefined) {
//     scope = scope[part];
//     part = original.substring(0, original.indexOf('.'));
//     original = original.substring(original.indexOf('.') + 1);
//     iiLib.getCorrectScope(part, original, scope);
//   }
//   else {
//     return iiLib.getSuggestion(part, scope);
//   }
// };

iiLib.getSuggestion = require('../lib/getSuggestion');

iiLib.areSimilarEnough = require('../lib/areSimilarEnough');

iiLib.levenshtein = require('../lib/levenshtein');

}((typeof module !== 'undefined' && module && module.exports) ?
      (module.exports = window.iiLib = {}) : (window.iiLib = {}) ));

},{"../lib/areSimilarEnough":3,"../lib/buildMessage":4,"../lib/concatParts":5,"../lib/delayDisplay":6,"../lib/displayMessages":7,"../lib/getAllParts":8,"../lib/getInterpolation":9,"../lib/getOperands":10,"../lib/getSuggestion":11,"../lib/levenshtein":12,"../lib/partsEvaluate":13,"angular-hint-log":14}],3:[function(require,module,exports){
module.exports = function(s,t) {
  var strMap = {}, similarities = 0, STRICTNESS = 0.66;
  if(Math.abs(s.length-t.length) > 3) {
    return false;
  }
  s.split('').forEach(function(x){strMap[x] = x;});
  for (var i = t.length - 1; i >= 0; i--) {
    similarities = strMap[t.charAt(i)] ? similarities + 1 : similarities;
  }
  return similarities >= t.length * STRICTNESS;
};

},{}],4:[function(require,module,exports){
module.exports = function(allParts, originalInterpolation, scope, $timeout) {
  var message = iiLib.partsEvaluate(allParts, originalInterpolation, scope);
  if(message && iiLib.ngHintInterpMessages.indexOf(message) < 0) {
    iiLib.ngHintInterpMessages.push(message);
    iiLib.ngHintInterpMessages.push(scope.$parent);
    iiLib.delayDisplay(iiLib.ngHintInterpMessages, $timeout);
  }
};

},{}],5:[function(require,module,exports){
module.exports = function(parts,concatLength) {
  var total = '';
  for(var i = 0; i <= concatLength; i++) {
    var period = (i===0) ? '' : '.';
    total+=period+parts[i].trim();
  }
  return total;
};

},{}],6:[function(require,module,exports){
module.exports = function(messages, $timeout) {
  $timeout.cancel(iiLib.currentPromises);
  iiLib.currentPromises = $timeout(function() {
    iiLib.displayMessages(messages);
  }.bind(this),250);
};

},{}],7:[function(require,module,exports){
module.exports = function(messages){
  for(var i = 0; i < messages.length; i+=2) {
    hintLog.createErrorMessage(messages[i], iiLib.errorNumber = ++iiLib.errorNumber, messages[i+1]);
  }
};

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
module.exports = function(text, startSym, endSym) {
  var startInd = text.indexOf(startSym) + startSym.length;
  var endInd = text.indexOf(endSym);
  return text.substring(startInd, endInd);
};

},{}],10:[function(require,module,exports){
module.exports = function(str) {
  return str.split(/[\+\-\/\|<\>\^=&!%~]/g);
};

},{}],11:[function(require,module,exports){
module.exports = function (part, scope) {
  var min_levDist = Infinity, closestMatch = '';
  for(var i in scope) {
    if(iiLib.areSimilarEnough(part, i)) {
      var currentlevDist = iiLib.levenshtein(part, i);
      closestMatch = (currentlevDist < min_levDist)? i : closestMatch;
      min_levDist = (currentlevDist < min_levDist)? currentlevDist : min_levDist;
    }
  }
  return closestMatch;
};
},{}],12:[function(require,module,exports){
module.exports = function(s, t) {
  if(typeof s !== 'string' || typeof t !== 'string') {
    throw new Error('Function must be passed two strings, given: '+typeof s+' and '+typeof t+'.');
  }
  var d = [];
  var n = s.length;
  var m = t.length;

  if (n === 0) {return m;}
  if (m === 0) {return n;}

  for (var ii = n; ii >= 0; ii--) { d[ii] = []; }
  for (var ii = n; ii >= 0; ii--) { d[ii][0] = ii; }
  for (var jj = m; jj >= 0; jj--) { d[0][jj] = jj; }
  for (var i = 1; i <= n; i++) {
    var s_i = s.charAt(i - 1);

    for (var j = 1; j <= m; j++) {
      if (i == j && d[i][j] > 4) return n;
      var t_j = t.charAt(j - 1);
      var cost = (s_i == t_j) ? 0 : 1;
      var mi = d[i - 1][j] + 1;
      var b = d[i][j - 1] + 1;
      var c = d[i - 1][j - 1] + cost;
      if (b < mi) mi = b;
      if (c < mi) mi = c;
      d[i][j] = mi;
      if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }
  return d[n][m];
};
},{}],13:[function(require,module,exports){
module.exports = function(allParts, originalInterpolation, scope) {
  var message, found = false;
  allParts.forEach(function(part) {
    if(!scope.$eval(part) && !found){
      found = true;
      var tempScope = scope.$eval(part.substring(0, part.lastIndexOf('.')));
      var tempPart = part.substring(part.lastIndexOf('.') + 1);
      var suggestion = iiLib.getSuggestion(tempPart, tempScope);
      suggestion = (suggestion) ? ' Try: "'+suggestion+'"' : '';
      message = '"'+part+'" was found to be undefined in "'+originalInterpolation+'".'+ suggestion;
    }
  });
  return message;
};

},{}],14:[function(require,module,exports){
(function (hintLog) {

  hintLog.throwError = false;
  hintLog.debugBreak = false;
  hintLog.propOnly = false;
  hintLog.includeLine = true;
  hintLog.setLogDefault = function(defaultToSet, status) {
    switch(defaultToSet) {
      case 'throwError' :
        hintLog.throwError = status;
        break;
      case 'debuggerBreakpoint' :
        hintLog.debugBreak = status;
        break;
      case 'propertyOnly' :
        hintLog.propOnly = status;
        break;
      case 'includeLine' :
        hintLog.includeLine = status;
        break;
      default :
        throw new Error('Tried to set unknown log default: ' + defaultToSet);
    }
  };

  //Record past messages so that the same line number will not
  //be repeatedly reported
  hintLog.pastMessages = {};
  hintLog.currentMessages = [];
  hintLog.lines = [];
  hintLog.domElements = {};
  hintLog.moduleName;
  hintLog.moduleDescription;
  hintLog.lineNumber = 1;


  //Log messages periodically
  hintLog.printAvailableMessages = function(printFrequency) {
    setTimeout(function() {
      if(hintLog.currentMessages.length > 0) {
        //Provide formatted messages if browsers allow
        if(console.groupCollapsed && console.warn) {
          hintLog.logFormattedMessages();
        }
        //Default to console.log which is available in all browsers
        else {
          hintLog.logMessages();
        }
      }
    }, printFrequency);
  };

  hintLog.printAvailableMessages(500);

  hintLog.logFormattedMessages = function() {
    console.groupCollapsed('Angular Hint: ' + hintLog.moduleName + ' ' + hintLog.moduleDescription);
    for(var i = 0; i < hintLog.currentMessages.length; i++) {
      if(hintLog.includeLine && hintLog.moduleName != 'Directives' && hintLog.moduleName != 'Interpolation') {
        console.warn(hintLog.currentMessages[i] + ' ' + hintLog.lines[i]);
      }
      else {
        console.groupCollapsed(hintLog.currentMessages[i]);
      }
      if(hintLog.moduleName === 'Directives' || hintLog.moduleName === 'Interpolation') {
        console.log(hintLog.domElements[hintLog.lines[i]]);
        console.groupEnd();
      }
    }
    console.groupEnd();
  };

  hintLog.logMessages = function() {
    console.log('Angular Hint: ' + hintLog.moduleName + ' ' + hintLog.moduleDescription);
    for(var i = 0; i < hintLog.currentMessages.length; i++) {
      if(hintLog.includeLine) {
        console.log(hintLog.currentMessages[i] + ' ' + hintLog.lines[i]);
      }
      else {
        console.log(hintLog.currentMessages[i]);
      }
      if(hintLog.moduleName === 'Directives' || hintLog.moduleName === 'Interpolation') {
        console.log(hintLog.domElements[hintLog.lines[i]]);
      }
    }
  }

  hintLog.foundError = function(error) {
    if(hintLog.debugBreak) {
      debugger;
    }
    else if(hintLog.throwError) {
      throw new Error(error + ' ' + hintLog.findLineNumber(hintLog.lineNumber));
    }
    else {
      if(hintLog.moduleName === 'Directives' || hintLog.moduleName === 'Interpolation') {
        if(!hintLog.propOnly) {
          hintLog.createErrorMessage(error, hintLog.findLineNumber(hintLog.lineNumber), domElement);
        }
        else {
          hintLog.createErrorMessage(error, hintLog.findLineNumber(hintLog.lineNumber));
        }
      }
      else {
        hintLog.createErrorMessage(error, hintLog.findLineNumber(hintLog.lineNumber));
      }
    }
  };

  hintLog.findLineNumber = function(splitNumber) {
    var e = new Error();
    //Find the line in the user's program rather than in this service
    var lineNum = e.stack.split('\n')[splitNumber];
    lineNum = lineNum.split('<anonymous> ')[1] || lineNum;
    return lineNum;
  };

  hintLog.createErrorMessage = function(error, lineNumber, domElement) {
    if(!hintLog.pastMessages[lineNumber]) {
      hintLog.pastMessages[lineNumber] = lineNumber;
      hintLog.currentMessages.push(error);
      hintLog.lines.push(lineNumber);
      if(domElement) {
        hintLog.domElements[lineNumber] = domElement;
      }
    }
  };

}((typeof module !== 'undefined' && module && module.exports) ?
      (module.exports = window.hintLog = {}) : (window.hintLog = {}) ));
},{}]},{},[1])