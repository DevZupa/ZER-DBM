'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('BuildCtrl',["$scope","$rootScope","$http","$location","$routeParams", function ($scope,$rootScope,$http,$location,$routeParams) {
        $(".nav li").removeClass("active");

        $("#buildings").addClass("active");

        var PC = $scope;
        var RS = $rootScope;

        PC.loadingData = true;
        PC.showMessage = "This window will get better in future releases. No editing yet.";
        PC.key = $routeParams.key;

        $http.post(RS.selectedServer['serverUrl'] + 'getKeyData.php?date='+ new Date().getTime(),{"secret": String(CryptoJS.MD5(RS.selectedServer['rpw'])) , "instance": RS.selectedServer['ri'], "db" : RS.selectedServer['dbi'], "key": PC.key }).
            success(function(data, status, headers, config) {
                PC.player = beautify(data);
                PC.loadingData = false;
            }).error(function(error){
                PC.loadingData = false;
                alert("Can't get building data.");
            });

        function beautify(data) {
            if (data.length > 1){
                var value = data;
                var player = {};
                player.name = value[0];
                player.x = value[1][0][0];
                player.y = value[1][0][1];
                player.medical = value[1][1];
                player.medical2 = value[1][2];
                player.owner = value[3];


                return player;

            }else{
                PC.showMessage = "This building seems to have no data. His data is corrupted or empty";
                return {};
            }
        }

        PC.seePlayer = seePlayer;

        function seePlayer(where){
            $location.path('/player/' + where);

        }
  }]);
