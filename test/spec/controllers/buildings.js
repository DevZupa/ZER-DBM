'use strict';

describe('Controller: BuildingsCtrl', function () {

  // load the controller's module
  beforeEach(module('zepochRedisApp'));

  var BuildingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuildingsCtrl = $controller('BuildingsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
