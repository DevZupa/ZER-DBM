'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:PlayersCtrl
 * @description
 * # PlayersCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('PlayersCtrl', function ($scope,$timeout) {
        $(".nav li").removeClass("active");

        $("#players").addClass("active");


        var PC = $scope;



        PC.players = [ // the player objects.
            { name : "Zupa" ,sex:"Male", puid : "798746579897", clothing:"", vestInventory:"", backpackInventory:"" , inventory:"", tools: "", weapons:""},
            { name : "Shane" ,sex:"Male", puid : "798746579897", clothing:"", vestInventory:"", backpackInventory:"" , inventory:"", tools: "", weapons:""},
            { name : "infiStar" ,sex:"Male", puid : "798746579897", clothing:"", vestInventory:"", backpackInventory:"" , inventory:"", tools: "", weapons:""},
            { name : "Maca" ,sex:"Male", puid : "798746579897", clothing:"", vestInventory:"", backpackInventory:"" , inventory:"", tools: "", weapons:""},
            { name : "MCU" ,sex:"Male", puid : "798746579897", clothing:"", vestInventory:"", backpackInventory:"" , inventory:"", tools: "", weapons:""},
            { name : "Zupa" ,sex:"Male", puid : "798746579897", clothing:"", vestInventory:"", backpackInventory:"" , inventory:"", tools: "", weapons:""},
            { name : "Shane" ,sex:"Male", puid : "798746579897", clothing:"", vestInventory:"", backpackInventory:"" , inventory:"", tools: "", weapons:""},
            { name : "infiStar" ,sex:"Male", puid : "798746579897", clothing:"", vestInventory:"", backpackInventory:"" , inventory:"", tools: "", weapons:""},
            { name : "Maca" ,sex:"Male", puid : "798746579897", clothing:"", vestInventory:"", backpackInventory:"" , inventory:"", tools: "", weapons:""},
            { name : "MCU" ,sex:"Male", puid : "798746579897", clothing:"", vestInventory:"", backpackInventory:"" , inventory:"", tools: "", weapons:""}

        ];


        PC.currentPage = 1; //current page
        PC.maxSize = 5; //pagination max size
        PC.entryLimit = 5; //max rows for data table

        /* init pagination with $scope.list */
        PC.noOfPages = Math.ceil(PC.players.length/PC.entryLimit);
        PC.setPage = function(pageNo) {
            PC.currentPage = pageNo;
        };

        PC.filter = function() {
            $timeout(function() { //wait for 'filtered' to be changed
                /* change pagination with $scope.filtered */
                PC.noOfPages = Math.ceil(PC.filtered.length/PC.entryLimit);
            }, 10);
        };

  });
