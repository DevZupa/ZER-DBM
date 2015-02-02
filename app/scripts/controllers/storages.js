'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:VehiclesCtrl
 * @description
 * # VehiclesCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('StoragesCtrl', function ($scope,$rootScope,$http,$location) {
        $(".nav li").removeClass("active");

        $("#storages").addClass("active");

        var PC = $scope;
        var RS = $rootScope;

        PC.storages = [];
        PC.storagesTypes = {};
        PC.storagesCount = 0;
        PC.loadingData = true;



        function getData(){
        $http.post(RS.selectedServer['serverUrl'] + 'getStorageData.php?date='+ new Date().getTime(),{"secret": String(CryptoJS.MD5(RS.selectedServer['rpw'])) , "instance": RS.selectedServer['ri'], "db" : RS.selectedServer['dbi'] }).
            success(function(data, status, headers, config) {
                PC.storagesTypes = {};
                PC.storages = [];
                PC.unEpochorize(data);

                PC.storagesCount = PC.vehicles.length;
                PC.loadingData = false;
            }).error(function(error){
                PC.loadingData = false;
                alert("Can't get storage data.");
            });
        }

        getData();

        function refreshData(){
            PC.loadingData = true;
            getData();
        }

        PC.refreshData = refreshData;

        PC.currentPage = 1; //current page
        PC.pageSize = 20; //pagination max size


        PC.unEpochorize = unEpochorize;

        function unEpochorize(data){

            var counter = 0;
            angular.forEach(data, function (value, key) {

                var data = value[1];
                var key = value[0];

                if (data.length > 1){

                    var vehicle = {};
                    vehicle.name = data[0];

                    if(data[0].indexOf("LockBoxProxy_EPOCH") > -1) {
                        vehicle.type = "lock";
                    }else {
                        vehicle.type = "storage";
                    }

                    vehicle.owner = data[5][0];
                    vehicle.key = key;
                    vehicle.gear = data[3];

                    if(vehicle.name in PC.storagesTypes){
                        PC.storagesTypes[vehicle.name].ammount++;
                    }else{
                        PC.storagesTypes[vehicle.name] = {
                            ammount : 1,
                            name : vehicle.name,
                            type: vehicle.type
                        };
                    }

                    PC.storages.push(vehicle);

                }
                counter++;
            });
        }
        PC.edit = edit;
        PC.seePlayer = seePlayer;

        function edit(where){
            $location.path('/storage/' + where);

        }

        function seePlayer(where){
            $location.path('/player/' + where);

        }




    });
