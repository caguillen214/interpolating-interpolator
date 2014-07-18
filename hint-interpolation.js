'use strict';

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
              iiLib.delayDisplay(ngHintInterpMessages, $timeout);
            }
            return result;
          };
        };
        angular.extend(interpolateWrapper,$delegate);
        return interpolateWrapper;
    }]);
  }]);
