'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:ServerAddCtrl
 * @description
 * # ServerAddCtrl
 * Controller of the ERDBM
 */
angular.module('ERDBM')
  .controller('ServerAddCtrl',[ "$scope","$rootScope","$location",function ($scope,$rootScope,$location) {

        $(".nav li").removeClass("active");

        $("#settings").addClass("active");

        var SAC = $scope;
        var RS = $rootScope;

        SAC.addServer = addServer;
        SAC.importServer = importServer;

        SAC.newServer = {
            serverUrl : "server/",
            redisport : 6379,
            port : 2302
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




  }]);
