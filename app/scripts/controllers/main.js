'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('MainCtrl', function ($scope) {
        $(".nav li").removeClass("active");

        $("#dashboard").addClass("active");
  });
