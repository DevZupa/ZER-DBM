'use strict';

/**
 * @ngdoc overview
 * @name zepochRedisApp
 * @description
 * # zepochRedisApp
 *
 * Main module of the application.
 */
var ERDBM = angular
  .module('zepochRedisApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularLocalStorage',
    'kendo.directives',
      'NgSwitchery',
        'ui.bootstrap'
  ]);



// does the uri routing to pages/controllers
ERDBM.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/players', {
        templateUrl: 'views/players.html',
        controller: 'PlayersCtrl'
      })
      .when('/banks', {
        templateUrl: 'views/banks.html',
        controller: 'BanksCtrl'
      })
      .when('/player', {
        templateUrl: 'views/player.html',
        controller: 'PlayerCtrl'
      })
      .when('/deathlogs', {
        templateUrl: 'views/deathlogs.html',
        controller: 'DeathlogsCtrl'
      })
      .when('/adminlogs', {
        templateUrl: 'views/adminlogs.html',
        controller: 'AdminlogsCtrl'
      })
      .when('/vehicles', {
        templateUrl: 'views/vehicles.html',
        controller: 'VehiclesCtrl'
      })
      .when('/buildings', {
        templateUrl: 'views/buildings.html',
        controller: 'BuildingsCtrl'
      })
      .when('/buildings', {
        templateUrl: 'views/buildings.html',
        controller: 'BuildingsCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/server/add', {
        templateUrl: 'views/server/add.html',
        controller: 'ServerAddCtrl'
      })
      .when('/server', {
        templateUrl: 'views/server.html',
        controller: 'ServerCtrl'
      })
      .when('/traders', {
        templateUrl: 'views/traders.html',
        controller: 'TradersCtrl'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .when('/map2', {
        templateUrl: 'views/map2.html',
        controller: 'Map2Ctrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

ERDBM.run(
    function($rootScope,storage,$route,$location) {

        //bind that stupid $name to something more useable.
        var globalScope = $rootScope;

        //define storage variables so my EDI sees them as a variable :)
        globalScope.servers = [];
        globalScope.selectedServer = null;

        // bind localstorage to global var.
        storage.bind(globalScope,'servers',{defaultValue: []});
        storage.bind(globalScope,'selectedServer',{defaultValue: null});

        storage.bind(globalScope,'imageOnMale',{defaultValue: 'images/male.png'});
        storage.bind(globalScope,'imageCar',{defaultValue: 'images/car.png'});
        storage.bind(globalScope,'imageHeli',{defaultValue: 'images/heli.png'});
        storage.bind(globalScope,'imageBoat',{defaultValue: 'images/boat.png'});
        storage.bind(globalScope,'imageLock',{defaultValue: 'images/lock.png'});
        storage.bind(globalScope,'imageBuilding',{defaultValue: 'images/walls.png'});
        storage.bind(globalScope,'imageStorage',{defaultValue: 'images/storage.png'});

        storage.bind(globalScope,'serverLink',{defaultValue: "http://localhost/uk431/ZRDBM/"});

        globalScope.serverLink = "http://37.187.135.190/uk431/ZRDBM/";

        globalScope.servers = [
            { name : "Zupa Epoch #1" , ip: "85.851.124.125" , port : "2502" , rpw : "redispass" , ri : "redisInstace" , rp : "redisPort", map:"Altis"},
        //    { name : "Zupa Epoch #2" , ip: "85.851.124.125" , port : "2502" , rpw : "redispass" , ri : "redisInstace" , rp : "redisPort"}
        ];

        // client check if the players needs to give in a server first.
        globalScope.hasServers = false;
        if(globalScope.servers.length > 0){
            globalScope.hasServers = true;
            changeServer(0);
        }

        // bind functions
        globalScope.changeServer = changeServer;

        // define functions
        function changeServer (index){
            globalScope.selectedServer = globalScope.servers[index];
            $route.reload();
        }

        if(!globalScope.hasServers){
            $location.path('/server/add');
        }



    }
);

ERDBM.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});
