'use strict';

describe('Controller: DeathlogsCtrl', function () {

  // load the controller's module
  beforeEach(module('zepochRedisApp'));

  var DeathlogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeathlogsCtrl = $controller('DeathlogsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
