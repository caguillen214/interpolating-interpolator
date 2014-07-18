(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var iiLib = require('./ii-lib/ii-lib.js');

angular.module('ngHintInterpolation', [])
  .config(['$provide', function($provide) {
    var ngHintInterpMessages = [];
    $provide.decorator('$interpolate', ['$delegate', '$timeout',
      function($delegate, $timeout) {
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
            var original = interpolationArgs[0];
            var args = arguments[0];
            var found = false;
            var message;
            allParts.forEach(function(part) {
              if(!args.$eval(part) && !found){
                found = true;
                message = '"'+part+'" was found to be undefined in "'+original.trim()+'".';
              }
            });
            if(message && ngHintInterpMessages.indexOf(message) < 0) {
              ngHintInterpMessages.push(message);
              ngHintInterpMessages.push(args.$parent);
              iiLib.delayDisplay(ngHintInterpMessages,$timeout);
            }
            return result;
          };
        };
        angular.extend(interpolateWrapper,$delegate);
        return interpolateWrapper;
    }]);
  }]);

},{"./ii-lib/ii-lib.js":2}],2:[function(require,module,exports){
'use strict';

var hintLog = require('angular-hint-log');
hintLog.moduleName = 'Directives';
hintLog.moduleDescription = '';

var iiLib = {
  currentPromises: {},
  errorNumber: 0
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
  });
  return comboParts;
};

iiLib.getInterpolation = function(text, startSym, endSym) {
  var startInd = text.indexOf(startSym) + startSym.length;
  var endInd = text.indexOf(endSym);
  return text.substring(startInd, endInd);
};

iiLib.getOperands = function(str) {
  return str.split(/[\+\-\/\|<\>\^=&!%~]/g);
};

iiLib.concatParts = function(parts, concatLength) {
  var total = '';
  for(var i = 0; i <= concatLength; i++) {
    var period = (i===0) ? '' : '.';
    total+=period+parts[i].trim();
  }
  return total;
};
iiLib.delayDisplay = function(messages, $timeout) {
  $timeout.cancel(iiLib.currentPromises);
  iiLib.currentPromises = $timeout(function() {
    iiLib.displayMessages(messages);
  }.bind(this),250);
};

iiLib.displayMessages1 = function(messages) {
  for(var i = 0; i < messages.length; i+=2) {
    hintLog.createErrorMessage(messages[i], iiLib.errorNumber = ++iiLib.errorNumber, messages[i+1]);
  }
};


iiLib.displayMessages = function(messages){
  console.groupCollapsed('Angular Hint: Interpolation');
  for(var i = 0; i < messages.length; i+=2) {
    console.groupCollapsed(messages[i]);
    console.warn(messages[i+1]);
    console.groupEnd();
  }
  console.groupEnd();
};












},{"angular-hint-log":3}],3:[function(require,module,exports){
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
      if(hintLog.includeLine && hintLog.moduleName != 'Directives') {
        console.warn(hintLog.currentMessages[i] + ' ' + hintLog.lines[i]);
      }
      else {
        console.warn(hintLog.currentMessages[i]);
      }
      if(hintLog.moduleName === 'Directives') {
        console.log(hintLog.domElements[hintLog.lines[i]]);
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
      if(hintLog.moduleName === 'Directives') {
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
      if(hintLog.moduleName === 'Directives') {
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