'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:VehiclesCtrl
 * @description
 * # VehiclesCtrl
 * Controller of the ERDBM
 */
angular.module('ERDBM')
  .controller('StoragesCtrl',["$scope","$rootScope","$http","$location", function ($scope,$rootScope,$http,$location) {
        $(".nav li").removeClass("active");

        $("#storages").addClass("active");

        var PC = $scope;
        var RS = $rootScope;

        PC.storages = [];
        PC.storagesTypes = {};
        PC.storagesCount = 0;
        PC.loadingData = true;
        PC.dataStorages = [];

        $scope.options =  {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : true,

            //String - The colour of each segment stroke
            segmentStrokeColor : '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth : 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout : 50, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect
            animationEasing : 'easeOutBounce',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate : true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale : false,

            //String - A legend template
            legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

        };

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
                        if(data[0].indexOf("StorageShelf_EPOCH") > -1) {
                            vehicle.type = "shelve";
                        }else {
                            vehicle.type = "storage";
                        }

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

            PC.dataStorages = [];
            PC.tempDate = [];
            angular.forEach(PC.storagesTypes, function (value, key) {
                var storage = {};
                storage.value = value.ammount;
                storage.color = getRandomColor();
                storage.highlight = "#aaa";
                storage.label = value.name;
                PC.tempDate.push(storage);
            });

            PC.dataStorages =  PC.tempDate;

        }
        PC.edit = edit;
        PC.seePlayer = seePlayer;

        function edit(where){
            $location.path('/storage/' + where);

        }

        function seePlayer(where){
            $location.path('/player/' + where);

        }

        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }


    }]);
