'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:PlayersCtrl
 * @description
 * # PlayersCtrl
 * Controller of the ERDBM
 */
ERDBM
  .controller('PlayersCtrl',["$scope","$timeout","$rootScope","$http","$location", function ($scope,$timeout,$rootScope,$http,$location) {
        $(".nav li").removeClass("active");

        $("#players").addClass("active");

        var PC = $scope;
        var RS = $rootScope;

        PC.players = RS.players;
        PC.filtered = [];
        PC.playersCount = PC.players.length;
        PC.loadingData = true;
        PC.females = 0;
        PC.males = 0;
        PC.uniformTypes = {};

        $scope.options =  {

            // Sets the chart to be responsive
            responsive: false,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : true,

            //String - The colour of each segment stroke
            segmentStrokeColor : '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth : 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout : 0, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect
            animationEasing : 'easeOutBounce',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate : true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale : true,

            //String - A legend template
            legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

        };

        $scope.optionsPolar =  {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Show a backdrop to the scale label
            scaleShowLabelBackdrop : true,

            //String - The colour of the label backdrop
            scaleBackdropColor : 'rgba(255,255,255,0.75)',

            // Boolean - Whether the scale should begin at zero
            scaleBeginAtZero : true,

            //Number - The backdrop padding above & below the label in pixels
            scaleBackdropPaddingY : 2,

            //Number - The backdrop padding to the side of the label in pixels
            scaleBackdropPaddingX : 2,

            //Boolean - Show line for each value in the scale
            scaleShowLine : true,

            //Boolean - Stroke a line around each segment in the chart
            segmentShowStroke : true,

            //String - The colour of the stroke on each segement.
            segmentStrokeColor : '#fff',

            //Number - The width of the stroke value in pixels
            segmentStrokeWidth : 2,

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect.
            animationEasing : 'easeOutBounce',

            //Boolean - Whether to animate the rotation of the chart
            animateRotate : true,

            //Boolean - Whether to animate scaling the chart from the centre
            animateScale : false,

            //String - A legend template
            legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
        };

        PC.data = [];



        function getData(){
        $http.post(RS.selectedServer['serverUrl'] + 'getAllPlayersData.php?date='+ new Date().getTime(),{"secret": String(CryptoJS.MD5(RS.selectedServer['rpw'])) , "instance": RS.selectedServer['ri'], "db" : RS.selectedServer['dbi'] }).
            success(function(data, status, headers, config) {
                PC.females = 0;
                PC.males = 0;
                PC.players = [];
                PC.unEpochorize(data);

                PC.playersCount = PC.players.length;
                PC.loadingData = false;
            }).error(function(error){
                PC.loadingData = false;

                toaster.pop('', "Error", "Can not get player data.", 10000, 'trustedHtml');
            });
        }

        if(PC.playersCount == 0){
            PC.loadingData = true;
            getData();
        }else{
            PC.loadingData = false;
        }


        PC.currentPage = 1; //current page
        PC.pageSize = 20; //pagination max size


        PC.unEpochorize = unEpochorize;
        PC.edit = edit;
        PC.refreshData = refreshData;

        function edit(puid){
            $location.path('/player/'+puid);
        }

        function refreshData(){
            PC.loadingData = true;
            getData();
        }

        function unEpochorize(data){

            var counter = 0;

            angular.forEach(data[0], function (value, key) {


                if (value.length > 1){

                    var player = {};
                    player.direction = value[0][0];
                    player.x = value[0][1][0];
                    player.y = value[0][1][1];
                    player.z = value[0][1][2];
                    player.medical = value[1];
                    player.uniform = value[2][4];
                    player.goggles = value[2][0];
                    player.vest = value[2][2];
                    player.backpack = value[2][3];
                    player.headgear = value[2][1];
                    player.model = value[2][5];
                    if(player.model == "Epoch_Female_F"){
                        player.sex = "female";
                        PC.females++;

                    }else{
                        PC.males++;
                        player.sex = "male";
                    }

                    if(player.uniform in PC.uniformTypes){
                        PC.uniformTypes[player.uniform].ammount++;
                    }else{
                        PC.uniformTypes[player.uniform] = {
                            ammount : 1,
                            name : player.uniform
                        };
                    }

                    player.name = value[3][0];
                    player.vars = value[4];
                    player.weapons = value[5];
                    player.assignedItems = value[6];
                    player.magazines = value[7];
                    player.itemCargos = value[8];
                    player.weaponsCargos = value[9];
                    player.PUID = data[1][counter].replace("Player:", "");
                    player.revive = value[11];

                    PC.players.push(player);

                }
                counter++;
            });

            PC.tempDate = [];
            PC.dataUniforms = [];

            PC.uniformTypesArray = [];

            PC.loopCount = 0;

            angular.forEach(PC.uniformTypes, function (value, key) {
                PC.uniformTypesArray.push({name:value.name,ammount:value.ammount})
            });

            PC.uniformTypesArray.sort(compare);


            angular.forEach(PC.uniformTypesArray, function (value, key) {

                if( PC.loopCount < 5) {
                    var uniform = {};
                    uniform.value = [value.ammount];
                    uniform.color = getRandomColor();
                    uniform.highlight = "#aaa";
                    uniform.label = value.name;
                    PC.tempDate.push(uniform);
                    PC.loopCount++;
                };
            });

            PC.dataUniforms = PC.tempDate;

            PC.data = [
                {
                    value: PC.males,
                    color:'#ff0000',
                    highlight: '#FF3333',
                    label: 'Male'
                },
                {
                    value: PC.females,
                    color: '#FF3399',
                    highlight: '#FF70B8',
                    label: 'Female'
                }
            ];

        }

        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function compare(a,b) {
            if (a.ammount < b.ammount)
                return 1;
            if (a.ammount > b.ammount)
                return -1;
            return 0;
        }


  }]);
