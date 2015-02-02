'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:BuildingsCtrl
 * @description
 * # BuildingsCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('BuildingsCtrl', function ($scope,$rootScope,$location,$http) {
        $(".nav li").removeClass("active");

        $("#buildings").addClass("active");

        var PC = $scope;
        var RS = $rootScope;

        PC.buildings = [];
        PC.buildingsTypes = {};
        PC.buildingsCount = 0;
        PC.loadingData = true;

        PC.walls = 0;
        PC.doors= 0;

        function getData(){
            $http.post(RS.selectedServer['serverUrl'] + 'getBuildingData.php?date='+ new Date().getTime(),{"secret": String(CryptoJS.MD5(RS.selectedServer['rpw'])) , "instance": RS.selectedServer['ri'], "db" : RS.selectedServer['dbi'] }).
                success(function(data, status, headers, config) {
                    PC.buildingsTypes = {};
                    PC.buildings = [];
                    PC.unEpochorize(data);

                    PC.buildingsCount = PC.vehicles.length;
                    PC.loadingData = false;
                }).error(function(error){
                    PC.loadingData = false;
                    alert("Can't get building data.");
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
            PC.helis = 0;
            PC.cars= 0;
            PC.boats = 0;

            angular.forEach(data, function (value, key) {

                var data = value[1];
                var key = value[0];

                if (data.length > 1){

                    var vehicle = {};
                    vehicle.name = data[0];

                    if(data[0].indexOf("door") > -1 || data[0].indexOf("Door") > -1 || data[0].indexOf("garage") > -1 || data[0].indexOf("Garage") > -1) {

                        vehicle.type = "door";

                            PC.doors++;
                        }else {
                            vehicle.type = "wall";
                            PC.walls++;
                        }


                    vehicle.owner = data[3];
                    vehicle.key = key;

                    if(vehicle.name in PC.buildingsTypes){
                        PC.buildingsTypes[vehicle.name].ammount++;
                    }else{
                        PC.buildingsTypes[vehicle.name] = {
                            ammount : 1,
                            name : vehicle.name,
                            type: vehicle.type
                        };
                    }

                    PC.buildings.push(vehicle);

                }
                counter++;
            });
        }

        PC.edit = edit;
        PC.seePlayer = seePlayer;

        function edit(where){
            $location.path('/building/' + where);

        }

        function seePlayer(where){
            $location.path('/player/' + where);

        }



    });
