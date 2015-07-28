'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ERDBM
 */
ERDBM
  .controller('MainCtrl',["$scope","$rootScope","$location","$http", function ($scope,$rootScope,$location,$http) {

        $(".nav li").removeClass("active");

        $("#dashboard").addClass("active");

        var MC = $scope;
        var RS = $rootScope;

        MC.loadingData = true;

        MC.onlinePlayers = 0;
        MC.vehicles = 0;
        MC.buildings = 0;
        MC.players = 0;
        MC.traders = 0;
        MC.storages = 0;

        console.log(RS.selectedServer['serverUrl']);


        $http.post(RS.selectedServer['serverUrl'] + 'getDashboardData.php?date='+ new Date().getTime(),{"secret": String(CryptoJS.MD5(RS.selectedServer['rpw'])) , "instance": RS.selectedServer['ri'], "db" : RS.selectedServer['dbi'] }).
            success(function(data, status, headers, config) {

                console.log(data);
                MC.unEpochorize(data);

                MC.loadingData = false;
            }).error(function(error){
                MC.loadingData = false;
                alert("Can't get dashboard data.");
            });

        MC.unEpochorize = unEpochorize;

        function unEpochorize(data){
            MC.onlinePlayers = data[2];
            MC.players = data[1];
            MC.vehicles = data[3];
            MC.storages = data[4];
            MC.traders =  data[5];
            MC.buildings =  data[6];
        }

        MC.changeLoc = changeLoc;

        function changeLoc(where){
            $location.path(where);
        }


  }]);
