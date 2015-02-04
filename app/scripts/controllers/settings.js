'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('SettingsCtrl',["$scope","$rootScope","$location", function ($scope,$rootScope,$location) {
        $(".nav li").removeClass("active");

        $("#settings").addClass("active");


        var SC = $scope;
        var RC = $rootScope;

        SC.serverssettings = RC.servers;

        SC.importObject = "";

        SC.editServer = editServer;
        SC.exportServer = exportServer;

        SC.saveMap = saveMap;

        SC.importServer = importServer;

        SC.clusterRadius = RC.clusterRad;

        SC.newMap = {};

        function editServer(index){
            $location.path( "/server/" + index);
        }

        function saveMap(){
            RC.maps.push(SC.newMap);
            SC.newMap = {};
        }

        function importServer(){
            RC.servers.push(JSON.parse(SC.importObject));
            SC.importObject = "";
        }

        function exportServer(index){
            SC.master = angular.copy(SC.serverssettings[index]);
            delete SC.master.$$hashKey;
            SC.importObject = JSON.stringify(SC.master);
        }

  }]);
