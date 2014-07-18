angular.module('testModule', ['ngRoute','ngHintInterpolation'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      controller: 'iiLibController',
      controllerAs: 'iCtrl',
      templateUrl: 'iiLibDemo.html'
    }).
    otherwise({redirectTo: '/'});
  }]);

angular.module('testModule')
  .controller('iiLibController', ['$scope', function($scope) {
    $scope.name = 'Carlos Guillen';
    $scope.data = {
      text: {
        fill: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel!',
        somethingElse: {a:'a'},
        ray: [1,2,3],
      },
      helloName: function(name){ return 'hello, '+name},
      ray: [{a:'a',b:'b'},'banana','cashew']
    }
  }]);