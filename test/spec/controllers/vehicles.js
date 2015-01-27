'use strict';

describe('Controller: VehiclesCtrl', function () {

  // load the controller's module
  beforeEach(module('zepochRedisApp'));

  var VehiclesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VehiclesCtrl = $controller('VehiclesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
