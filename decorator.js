angular.module('iEyeLib', ['testModule', 'ngRoute'])
  .config(['$provide', '$routeProvider', function($provide, $routeProvider) {
    $routeProvider.when('/', {
        controller: 'iEyeController',
        controllerAs: 'iCtrl',
        templateUrl: 'iEyeDemo.html'
      }).
      otherwise({redirectTo: '/'});
    $provide.decorator('$interpolate', ['$delegate', function($delegate) {
      var interpolateWrapper = function() {
        var interpolationFn = $delegate.apply(this, arguments);
        if(interpolationFn) {
          var argC = arguments.callee;
          var parts = iEye.getAllParts(arguments[0],argC.startSymbol(),argC.endSymbol());
          var results = [];
          var temp = interpolationFnWrap(interpolationFn,arguments, parts);
          return temp;
        }
      }
      var interpolationFnWrap = function(interpolationFn, interpolationArgs, allParts) {
        return function(){
          var result = interpolationFn.apply(this, arguments);
          var original = interpolationArgs[0];
          var args = arguments[0];
          var found = false;
          allParts.forEach(function(part) {
            if(!args.$eval(part) && !found){
              found = true;
              console.warn(part+' was found to be undefined in "'+original.trim()+'".');
            }
          })
          return result;
        };
      }
      angular.extend(interpolateWrapper,$delegate);
      return interpolateWrapper;
    }]);
  }]);