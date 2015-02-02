'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:PlayersCtrl
 * @description
 * # PlayersCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('PlayersCtrl', function ($scope,$timeout,$rootScope,$http,$location) {
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
                alert("Can't get player data.");
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
        }





  });
