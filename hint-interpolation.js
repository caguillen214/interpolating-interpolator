'use strict';

var getAllParts = require('./lib/getAllParts');
var buildMessage = require('./lib/buildMessage');

angular.module('ngHintInterpolation', [])
  .config(['$provide', function($provide) {
    $provide.decorator('$interpolate', ['$delegate', function($delegate) {
      var interpolateWrapper = function() {
        var interpolationFn = $delegate.apply(this, arguments);
        if(interpolationFn) {
          var temp;
          var interpolation = arguments[0];
          if(interpolation.indexOf('?') === -1 && interpolation.indexOf(':') === -1) {
            var parts = getAllParts(interpolation, $delegate.startSymbol(), $delegate.endSymbol());
          }
          temp = interpolationFnWrap(interpolationFn, arguments, parts || []);
          return temp;
        }
      };
      var interpolationFnWrap = function(interpolationFn, interpolationArgs, allParts) {
        return function(){
          var result = interpolationFn.apply(this, arguments);
          var originalInterpolation = interpolationArgs[0].trim();
          buildMessage(allParts, originalInterpolation, arguments[0]);
          return result;
        };
      };
      angular.extend(interpolateWrapper, $delegate);
      return interpolateWrapper;
    }]);
  }]);
