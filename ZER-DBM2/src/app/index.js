'use strict';
/**
 * @ngdoc overview
 * @name ERDBM
 * @description
 * # ERDBM
 *
 * Main module of the application.
 */
var ERDBM = angular
  .module('ERDBM', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularLocalStorage',
    'NgSwitchery',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
    'toaster',
    'tc.chartjs'
  ]);
ERDBM.config(["$routeProvider",function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'app/views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/players', {
        templateUrl: 'app/views/players.html',
        controller: 'PlayersCtrl'
      })
      .when('/banks', {
        templateUrl: 'app/views/banks.html',
        controller: 'BanksCtrl'
      })
      .when('/deathlogs', {
        templateUrl: 'app/views/deathlogs.html',
        controller: 'DeathlogsCtrl'
      })
      .when('/adminlogs', {
        templateUrl: 'app/views/adminlogs.html',
        controller: 'AdminlogsCtrl'
      })
      .when('/vehicles', {
        templateUrl: 'app/views/vehicles.html',
        controller: 'VehiclesCtrl'
      })
      .when('/storages', {
          templateUrl: 'app/views/storages.html',
          controller: 'StoragesCtrl'
      })
      .when('/buildings', {
        templateUrl: 'app/views/buildings.html',
        controller: 'BuildingsCtrl'
      })
      .when('/buildings', {
        templateUrl: 'app/views/buildings.html',
        controller: 'BuildingsCtrl'
      })
      .when('/settings', {
        templateUrl: 'app/views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/server/add', {
        templateUrl: 'app/views/add.html',
        controller: 'ServerAddCtrl'
      })
      .when('/server/:param', {
        templateUrl: 'app/views/server.html',
        controller: 'ServerCtrl'
      })
      .when('/player/:param', {
          templateUrl: 'app/views/player.html',
          controller: 'PlayerCtrl'
      })
      .when('/vehicle/:key', {
          templateUrl: 'app/views/vehicle.html',
          controller: 'VehicleCtrl'
      })
      .when('/building/:key', {
          templateUrl: 'app/views/building.html',
          controller: 'BuildCtrl'
      })
      .when('/storage/:key', {
          templateUrl: 'app/views/storage.html',
          controller: 'StorageCtrl'
      })
      .when('/traders', {
        templateUrl: 'app/views/traders.html',
        controller: 'TradersCtrl'
      })
      .when('/map', {
        templateUrl: 'app/views/map.html',
        controller: 'MapCtrl'
      })
        .when('/map', {
        templateUrl: 'app/views/map.html',
        controller: 'MapCtrl'
      })
        .when('/login', {
            templateUrl: 'app/views/login.html',
            controller: 'AuthCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
  }]);

ERDBM.run(["$rootScope","storage","$location","$route","Data",
    function($rootScope,storage,$location,$route,Data) {

        var globalScope = $rootScope;

        globalScope.$on("$routeChangeStart", function (event, next, current) {
            globalScope.authenticated = false;
            Data.get('session').then(function (results) {
                if (results.uid) {
                    globalScope.authenticated = true;
                    globalScope.uid = results.uid;
                    globalScope.name = results.name;
                    globalScope.email = results.email;
                } else {
                     //   if($location.path()!= "/login"){
                      //           $location.path("/login");
                      //  }
                }
            })
        });



        globalScope.players = [];
        globalScope.vehicles = [];
        globalScope.vehiclesTypes = {};

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
        storage.bind(globalScope,'serverLink',{defaultValue: ""});
        storage.bind(globalScope,'clusterRad',{defaultValue: 30});

        globalScope.defaultMaps = [
            {name: "chernarus", x:15400, y:15400, offsetX : 0, offsetY:0},
            {name: "altis", x:30700, y:30500, offsetX : 0, offsetY:-3300},
            {name: "stratis", x:8192, y:8192, offsetX : 0, offsetY:0},
            {name: "takistan", x:12800, y:12800, offsetX : 0, offsetY:0},
            {name: "namalsk", x:12800, y:12800, offsetX : 0, offsetY:0},
            {name: "bornholm", x:22528, y:22528, offsetX : 0, offsetY:0}
        ];

        globalScope.mapiconsdef = [
            {image: "walls.png", name: "wall/floor", x:32, y:37},
            {image: "door.png", name: "door", x:32, y:37},
            {image: "heli.png", name: "heli", x:32, y:37},
            {image: "ship.png", name: "boat", x:32, y:37},
            {image: "car.png", name: "vehicle", x:32, y:37},
            {image: "atm.png", name: "atm", x:32, y:37},
            {image: "storage.png", name: "storage", x:32, y:37},
            {image: "lock.png", name: "lockbox", x:32, y:37},
            {image: "male.png", name: "male", x:32, y:37},
            {image: "female.png", name: "female", x:32, y:37},
            {image: "shelve.png", name: "shelve", x:32, y:37}
        ];

       storage.bind(globalScope,'mapRefresh',{defaultValue:  60});
       storage.bind(globalScope,'maps',{defaultValue:  globalScope.defaultMaps});
       storage.bind(globalScope,'mapicons',{defaultValue:  globalScope.mapiconsdef});
       storage.bind(globalScope,'leafletsize',{defaultValue:  8192});


        if(globalScope.mapicons.length < 11){
            globalScope.mapicons = globalScope.mapiconsdef;
        }

        // client check if the players needs to give in a server first.
        globalScope.hasServers = false;
        if(globalScope.servers.length > 0){
            globalScope.hasServers = true;
            changeServer(0);
        }

        // bind functions
        globalScope.changeServer = changeServer;
        globalScope.deleteServer = deleteServer;
        globalScope.deleteMap = deleteMap;

        // define functions
        function changeServer (index){
            globalScope.selectedServer = globalScope.servers[index];
            $route.reload();

        }

        function deleteServer ( index){
            globalScope.servers.splice(index, 1);
            if(globalScope.servers.length > 0){
                globalScope.hasServers = true;
                changeServer(0);
            }else{
                $location.path('/server/add');
            }
        }

        function deleteMap (index){
            globalScope.maps.splice(index, 1);
        }

        if(!globalScope.hasServers){
            if($location.path() != "/login") {
                $location.path('/server/add');
            }
        }


    }]);

ERDBM.factory("Data", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

        var serviceBase = 'server/';

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            },function(results){
                return {};
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            },function(results){
                return {};
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            },function(results){
                return {};
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            },function(results){
                return {};
            });
        };

        return obj;
    }]);

ERDBM.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }
});

ERDBM.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {
                var e1 = scope.$eval(attrs.ngModel);
                var e2 = scope.$eval(attrs.passwordMatch);
                if(e2!=null)
                    return e1 == e2;
            };
            scope.$watch(checker, function (n) {
                control.$setValidity("passwordNoMatch", n);
            });
        }
    };
}]);

$(document).ready(function() {
    $(".dropdownjs").dropdown({"optionClass": "withripple"});
    console.log('init');
});