'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:ServerAddCtrl
 * @description
 * # ServerAddCtrl
 * Controller of the zepochRedisApp
 */
angular.module('zepochRedisApp')
  .controller('ServerAddCtrl', function ($scope,$rootScope) {

        $(".nav li").removeClass("active");

        $("#settings").addClass("active");

        var SAC = $scope;

        SAC.addServer = addServer;

        function addServer(){



        };




  });
