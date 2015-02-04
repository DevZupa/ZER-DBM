'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('PlayerCtrl',["$scope","$rootScope","$http","$location","$routeParams", function ($scope,$rootScope,$http,$location,$routeParams) {
        $(".nav li").removeClass("active");

        $("#players").addClass("active");

        var PC = $scope;
        var RS = $rootScope;

        PC.loadingData = true;
        PC.showMessage = "This window will get better in future releases. No editing yet.";
        PC.puid = $routeParams.param;

        $http.post(RS.selectedServer['serverUrl'] + 'getPlayerData.php?date='+ new Date().getTime(),{"secret": String(CryptoJS.MD5(RS.selectedServer['rpw'])) , "instance": RS.selectedServer['ri'], "db" : RS.selectedServer['dbi'], "puid": PC.puid }).
            success(function(data, status, headers, config) {
                PC.player = beautify(data);
                PC.loadingData = false;
            }).error(function(error){
                PC.loadingData = false;
                alert("Can't get player data.");
            });

        function beautify(data) {
            if (data.length > 1){
                var value = data;
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
                player.PUID = PC.puid;
                player.revive = value[11];

                return player;

            }else{
                PC.showMessage = "This player seems to have no data. His data is corrupted or empty";
                return {};
            }
        }
  }]);
