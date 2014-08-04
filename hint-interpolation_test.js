'use strict'

var hintLog = angular.hint;

describe('hintInterpolation integration test', function() {
  var $rootScope, $compile, $controller;

  beforeEach(module('ngHintInterpolation'));
  beforeEach(inject(function(_$rootScope_, _$compile_, _$controller_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $controller = _$controller_;
  }));


  it('should log a message using the hintLog pipeline when interpolation is undefined', function() {
    var html = '<a ng-href="{{data.results[0].urls.main_url}}"></a>';
    $compile(html)($rootScope);
    var log = hintLog.flush();
    expect(Object.keys(log['Interpolation'])).toEqual([' "data" was found to be undefined in ' +
      '"{{data.results[0].urls.main_url}}".']);
  });


  it('should make suggest close matches to undefined values if they are on the scope', function() {
    var html = '<a ng-href="{{data.results[0].urls.main_url}}"></a>';
    var scope = $rootScope.$new();
    var ctrl = $controller(function() {
      scope.datas = {
        results: ['something']
      };
    });
    $compile(html)(scope);
    var log = hintLog.flush();
    expect(Object.keys(log['Interpolation'])).toEqual([' "data" was found to be undefined in ' +
      '"{{data.results[0].urls.main_url}}". Try: "datas"']);
  });
});