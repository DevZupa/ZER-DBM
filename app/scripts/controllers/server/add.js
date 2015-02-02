'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:ServerAddCtrl
 * @description
 * # ServerAddCtrl
 * Controller of the zepochRedisApp
 */
angular.module('zepochRedisApp')
  .controller('ServerAddCtrl', function ($scope,$rootScope,$location) {

        $(".nav li").removeClass("active");

        $("#settings").addClass("active");

        var SAC = $scope;
        var RS = $rootScope;

        SAC.addServer = addServer;
        SAC.importServer = importServer;

        SAC.newServer = {
            serverUrl : "server/"
        };



        function addServer(){

           SAC.toaddserver = {
               name : SAC.newServer.name ,
               ip: SAC.newServer.ip ,
               port : SAC.newServer.port ,
               rpw : SAC.newServer.pass ,
               dbi : SAC.newServer.db ,
               ri : SAC.newServer.instance ,
               rp : SAC.newServer.redisport,
               map: SAC.newServer.map,
               serverUrl: SAC.newServer.serverUrl
           };


            RS.servers.push(SAC.toaddserver);
            RS.selectedServer = SAC.toaddserver;

            $location.path( "/settings" );

        };

        function importServer(){
            RS.servers.push(JSON.parse(SAC.importObject));
            SAC.importObject = "";
            $location.path( "/settings" );
        }




  });
