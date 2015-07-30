'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:VehiclesCtrl
 * @description
 * # VehiclesCtrl
 * Controller of the ERDBM
 */
angular.module('ERDBM')
  .controller('VehiclesCtrl',["$scope","$rootScope","$http","$location", function ($scope,$rootScope,$http,$location) {
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

        PC.data = [];

        PC.options =  {

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

            PC.data = [
                {
                    value: PC.cars,
                    color: getRandomColor(),
                    highlight: '#FF3333',
                    label: 'Cars'
                },
                {
                    value: PC.helis,
                    color: getRandomColor(),
                    highlight: '#FF70B8',
                    label: 'Helis'
                },
                {
                    value: PC.boats,
                    color: getRandomColor(),
                    highlight: '#FF70B8',
                    label: 'Boats'
                }
            ];
        }

        PC.edit = edit;

        function edit(where){
            $location.path('/vehicle/' + where);

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
