'use strict';

describe('Controller: ServerAddCtrl', function () {

  // load the controller's module
  beforeEach(module('zepochRedisApp'));

  var ServerAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServerAddCtrl = $controller('ServerAddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
