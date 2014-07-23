(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var getAllParts = require('./lib/getAllParts');
var buildMessage = require('./lib/buildMessage');

angular.module('ngHintInterpolation', [])
  .config(['$provide', function($provide) {
    var ngHintInterpMessages = [];
    $provide.decorator('$interpolate', ['$delegate', '$timeout', function($delegate, $timeout) {
      var interpolateWrapper = function() {
        var interpolationFn = $delegate.apply(this, arguments);
        if(interpolationFn) {
          var parts = getAllParts(arguments[0],$delegate.startSymbol(),$delegate.endSymbol());
          var temp = interpolationFnWrap(interpolationFn,arguments, parts);
          return temp;
        }
      };
      var interpolationFnWrap = function(interpolationFn, interpolationArgs, allParts) {
        return function(){
          var result = interpolationFn.apply(this, arguments);
          buildMessage(allParts, interpolationArgs[0].trim(), arguments[0], $timeout);
          return result;
        };
      };
      angular.extend(interpolateWrapper,$delegate);
      return interpolateWrapper;
    }]);
  }]);

},{"./lib/buildMessage":3,"./lib/getAllParts":6}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var hintLog = require('angular-hint-log');

var partsEvaluate = require('./partsEvaluate');
var delayDisplay = require('./delayDisplay');

module.exports = function(allParts, originalInterpolation, scope, $timeout) {
  var message = partsEvaluate(allParts, originalInterpolation, scope);
  if(message) {
    hintLog.logMessage(message);
  }
};

},{"./delayDisplay":5,"./partsEvaluate":11,"angular-hint-log":12}],4:[function(require,module,exports){
module.exports = function(parts, concatLength) {
  var total = '';
  for(var i = 0; i <= concatLength; i++) {
    var period = (i===0) ? '' : '.';
    total+=period+parts[i].trim();
  }
  return total;
};

},{}],5:[function(require,module,exports){
/*NOT USED*/
module.exports = function(messages, $timeout) {
  $timeout.cancel(iiLib.currentPromises);
  iiLib.currentPromises = $timeout(function() {
    iiLib.displayMessages(messages);
  }.bind(this),250);
};

},{}],6:[function(require,module,exports){
var getInterpolation = require('./getInterpolation');
var getOperands = require('./getOperands');
var concatParts = require('./concatParts');

module.exports = function(text, startSym, endSym) {
  if(text.indexOf(startSym) < 0 || text.indexOf(endSym) < 0) {
    throw new Error('Missing start or end symbol in interpolation. Start symbol: "'+startSym+
      '" End symbol: "'+endSym+'"');
  }
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

},{"./concatParts":4,"./getInterpolation":7,"./getOperands":8}],7:[function(require,module,exports){
module.exports = function(text, startSym, endSym) {
  var startInd = text.indexOf(startSym) + startSym.length;
  var endInd = text.indexOf(endSym);
  return text.substring(startInd, endInd);
};

},{}],8:[function(require,module,exports){
module.exports = function(str) {
  return str.split(/[\+\-\/\|<\>\^=&!%~]/g);
};

},{}],9:[function(require,module,exports){
var areSimilarEnough = require('./areSimilarEnough');
var levenshtein = require('./levenshtein');

module.exports = function (part, scope) {
  var min_levDist = Infinity, closestMatch = '';
  for(var i in scope) {
    if(areSimilarEnough(part, i)) {
      var currentlevDist = levenshtein(part, i);
      closestMatch = (currentlevDist < min_levDist)? i : closestMatch;
      min_levDist = (currentlevDist < min_levDist)? currentlevDist : min_levDist;
    }
  }
  return closestMatch;
};

},{"./areSimilarEnough":2,"./levenshtein":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
var getSuggestion = require('./getSuggestion');

module.exports = function(allParts, originalInterpolation, scope) {
  var message, found = false;
  allParts.forEach(function(part) {
    if(!scope.$eval(part) && !found){
      found = true;
      var tempScope = scope.$eval(part.substring(0, part.lastIndexOf('.')));
      var tempPart = part.substring(part.lastIndexOf('.') + 1);
      var suggestion = getSuggestion(tempPart, tempScope);
      suggestion = (suggestion) ? ' Try: "'+suggestion+'"' : '';
      message = '"'+part+'" was found to be undefined in "'+originalInterpolation+'".'+ suggestion;
    }
  });
  return message;
};

},{"./getSuggestion":9}],12:[function(require,module,exports){
var queuedMessages = [];
function logMessage(message) {
  queuedMessages.push(message);
  module.exports.onMessage(message);
};

function flush() {
  var flushMessages = queuedMessages;
  queuedMessages = [];
  return flushMessages;
};

module.exports.onMessage = function(message) {};
module.exports.logMessage = logMessage;
module.exports.flush = flush;
},{}]},{},[1])