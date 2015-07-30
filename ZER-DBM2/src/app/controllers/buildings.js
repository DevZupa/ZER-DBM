'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:BuildingsCtrl
 * @description
 * # BuildingsCtrl
 * Controller of the ERDBM
 */
angular.module('ERDBM')
  .controller('BuildingsCtrl',["$scope","$rootScope","$location","$http",function ($scope,$rootScope,$location,$http) {
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
        PC.foundation = 0;

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

                            if(data[0].indexOf("Foundation_EPOCH")>-1){
                                vehicle.type = "wall";
                                PC.foundation++;
                            }
                            else {
                                    vehicle.type = "wall";
                                    PC.walls++;
                                }
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



            PC.data = [
                {
                    value: PC.foundation,
                    color: getRandomColor(),
                    highlight: '#FF3333',
                    label: 'Foundation'
                },
                {
                    value: PC.walls,
                    color: getRandomColor(),
                    highlight: '#FF70B8',
                    label: 'Walls & Floors'
                },
                {
                    value: PC.doors,
                    color: getRandomColor(),
                    highlight: '#FF70B8',
                    label: 'Doors'
                }
            ];
        }

        PC.edit = edit;
        PC.seePlayer = seePlayer;

        function edit(where){
            $location.path('/building/' + where);

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
