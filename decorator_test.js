describe('iiLib and angular integration', function() {
  var $rootScope, $compile;
  beforeEach(module('ngHintInterpolation'));
  beforeEach(inject(function(_$rootScope_,_$compile_) {

    var html = '<div id="topTest"><p ng-src="">{{data.name}}</p></div>';
    var element = angular.element(html);
    $compile(element)($rootScope);
    $rootScope.$apply();

  }));

  describe('Decorator: $interpolate', function() {
    spyOn($provide.decorator,'displayMessages').andCallFake(function(messages) {
      console.log(messages);
    })
  });
});
