'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('SettingsCtrl', function ($scope,$rootScope,$location) {
        $(".nav li").removeClass("active");

        $("#settings").addClass("active");


        var SC = $scope;
        var RC = $rootScope;

        SC.serverssettings = RC.servers;

        SC.editServer = editServer;

        SC.saveMap = saveMap;

        SC.clusterRadius = RC.clusterRad;

        SC.newMap = {};

        function editServer(index){
            $location.path( "/server/" + index);
        }

        function saveMap(){
            RC.maps.push(SC.newMap);
            SC.newMap = {};
        }

  });
