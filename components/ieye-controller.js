angular.module('testModule', [])
  .controller('iEyeController', ['$scope', function($scope) {
    $scope.name = 'Carlos Guillen';
    $scope.data = {
      text: {
        fill: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel!',
        somethingElse: {a:'a'},
        ray: [1,2,3]
      },
      ray: [{a:'a',b:'b'},'banana','cashew']
    }
  }]);