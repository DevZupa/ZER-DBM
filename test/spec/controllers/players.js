'use strict';

describe('Controller: PlayersCtrl', function () {

  // load the controller's module
  beforeEach(module('zepochRedisApp'));

  var PlayersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayersCtrl = $controller('PlayersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
