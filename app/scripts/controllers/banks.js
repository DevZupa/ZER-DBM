'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:BanksCtrl
 * @description
 * # BanksCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('BanksCtrl',["$scope", function ($scope) {
        $(".nav li").removeClass("active");

        $("#banks").addClass("active");
  }]);
