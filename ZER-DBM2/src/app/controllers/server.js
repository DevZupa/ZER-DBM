'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:ServerCtrl
 * @description
 * # ServerCtrl
 * Controller of the ERDBM
 */
angular.module('ERDBM')
  .controller('ServerCtrl',["$scope","$rootScope","$location","$routeParams", function ($scope,$rootScope,$location,$routeParams) {
        $(".nav li").removeClass("active");

        $("#settings").addClass("active");



        var SAC = $scope;
        var RS = $rootScope;

        SAC.param = $routeParams.param;

        SAC.theserver = RS.servers[SAC.param];

        SAC.save = save;

        function save(){
            $location.path("/settings");
        }

  }]);
