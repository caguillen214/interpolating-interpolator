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
          if(arguments[0].indexOf('?') === -1 && arguments[0].indexOf(':') === -1) {
            var parts = getAllParts(arguments[0], $delegate.startSymbol(), $delegate.endSymbol());
            temp = interpolationFnWrap(interpolationFn, arguments, parts);
          } else {
            temp = interpolationFnWrap(interpolationFn, arguments, []);
          }
          return temp;
        }
      };
      var interpolationFnWrap = function(interpolationFn, interpolationArgs, allParts) {
        return function(){
          var result = interpolationFn.apply(this, arguments);
          buildMessage(allParts, interpolationArgs[0].trim(), arguments[0]);
          return result;
        };
      };
      angular.extend(interpolateWrapper,$delegate);
      return interpolateWrapper;
    }]);
  }]);
