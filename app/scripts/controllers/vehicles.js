'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:VehiclesCtrl
 * @description
 * # VehiclesCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('VehiclesCtrl', function ($scope,$rootScope,$http,$location) {
        $(".nav li").removeClass("active");

        $("#vehicles").addClass("active");

        var PC = $scope;
        var RS = $rootScope;

        PC.vehicles = [];
        PC.vehiclesTypes = {};
        PC.vehiclesCount = 0;
        PC.loadingData = true;

        PC.helis = 0;
        PC.cars= 0;
        PC.boats = 0;

        function getData(){
        $http.post(RS.selectedServer['serverUrl'] + 'getVehicleData.php?date='+ new Date().getTime(),{"secret": String(CryptoJS.MD5(RS.selectedServer['rpw'])) , "instance": RS.selectedServer['ri'], "db" : RS.selectedServer['dbi'] }).
            success(function(data, status, headers, config) {
                PC.vehiclesTypes = {};
                PC.vehicles = [];
                PC.unEpochorize(data);

                PC.vehiclesCount = PC.vehicles.length;
                PC.loadingData = false;
            }).error(function(error){
                PC.loadingData = false;
                alert("Can't get vehicle data.");
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

                    if(data[0].indexOf("heli") > -1 || data[0].indexOf("mosquito") > -1 || data[0].indexOf("Heli") > -1)
                    {
                       vehicle.type = "Heli";
                        PC.helis++;

                    }else{
                        if(data[0].indexOf("boat") > -1 || data[0].indexOf("Boat") > -1 || data[0].indexOf("Ship") > -1 || data[0].indexOf("ship") > -1 || data[0].indexOf("jetski") > -1)
                        {
                            vehicle.type = "Boat";

                            PC.boats++;
                        }else {
                            vehicle.type = "Car";
                            PC.cars++;
                        }
                    }

                    vehicle.x = data[1][0][0];
                    vehicle.y = data[1][0][1];
                    vehicle.key = key;

                    if(vehicle.name in PC.vehiclesTypes){
                        PC.vehiclesTypes[vehicle.name].ammount++;
                    }else{
                        PC.vehiclesTypes[vehicle.name] = {
                            ammount : 1,
                            name : vehicle.name,
                            type: vehicle.type
                        };
                    }

                    PC.vehicles.push(vehicle);

                }
                counter++;
            });
        }

        PC.edit = edit;

        function edit(where){
            $location.path('/vehicle/' + where);

        }




    });
