angular.module('iEyeLib', [])
  .config(['$provide',function($provide) {
    $provide.decorator('$interpolate', ['$delegate', function($delegate) {
      var interpolateWrapper = function() {
        var interpolationFn = $delegate.apply(this, arguments);
        if(interpolationFn) {
            return interpolationFnWrap(interpolationFn, arguments);
        }
      }
      var interpolationFnWrap = function(interpolationFn, interpolationArgs) {
        return function() {
          var results = interpolationFn.apply(this,arguments);
          var vals = interpolationArgs[0].trim();
          console.log(vals);
          return results;
        }
      }
      angular.extend(interpolateWrapper,$delegate);
      return interpolateWrapper;
    }]);
  }]);