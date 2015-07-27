'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:TradersCtrl
 * @description
 * # TradersCtrl
 * Controller of the ERDBM
 */
ERDBM
  .controller('TradersCtrl',[ "$scope",function ($scope) {
        $(".nav li").removeClass("active");

        $("#traders").addClass("active");
  }]);
