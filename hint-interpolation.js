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
