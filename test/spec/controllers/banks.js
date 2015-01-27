'use strict';

describe('Controller: BanksCtrl', function () {

  // load the controller's module
  beforeEach(module('zepochRedisApp'));

  var BanksCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BanksCtrl = $controller('BanksCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
