'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:BanksCtrl
 * @description
 * # BanksCtrl
 * Controller of the ERDBM
 */
angular.module('ERDBM')
  .controller('BanksCtrl',["$scope", function ($scope) {
        $(".nav li").removeClass("active");

        $("#banks").addClass("active");
  }]);
