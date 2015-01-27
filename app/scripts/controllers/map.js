'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the zepochRedisApp
 */
angular.module('zepochRedisApp')
  .controller('MapCtrl', function ($scope,storage,$http,$rootScope) {
        $(".nav li").removeClass("active");

        $("#map").addClass("active");

        var MC = $scope;
        var RS = $rootScope;

        MC.map = null;
        MC.oms = null;

        MC.serverURL = RS.serverLink;
		//MC.secretCode = CryptoJS.MD5(RS.secretPass);

		MC.secretCode = CryptoJS.MD5("npgforever1991");
	
		MC.instance = "NPGA3EPOCH2";	
	    MC.db = 1;		
		
        MC.x0 = -110;
        MC.y0 = -90;

        MC.lx = 0.007426086956521740; // 1 m to longitude
        MC.ly = 0.005826086956521740; // 1 m to latitude

        MC.csm = [];
        MC.spuid = "";
        MC.selectedKind = "Player";

        storage.bind(MC, 'showPlayers', {defaultValue: true});
        storage.bind(MC, 'showVehicles', {defaultValue: false});
        storage.bind(MC, 'showBuildings', {defaultValue: false});
        storage.bind(MC, 'showLocks', {defaultValue: false});
        storage.bind(MC, 'showStorages', {defaultValue: false});

        MC.$watch("showPlayers", function(newValue, oldValue) {
            doAllMarkers();
        });
        MC.$watch("showVehicles", function(newValue, oldValue) {
            doAllMarkers();
        });
        MC.$watch("showBuildings", function(newValue, oldValue) {
            doAllMarkers();
        });
        MC.$watch("showLocks", function(newValue, oldValue) {
            doAllMarkers();
        });
        MC.$watch("showStorages", function(newValue, oldValue) {
            doAllMarkers();
        });

        MC.playerCount = 0;
        MC.vehicleCount = 0;
        MC.buildingCount = 0;
        MC.lockCount = 0;
        MC.storageCount = 0;

        MC.players = [];
        MC.onlinePlayers = [];
        MC.vehicles = [];
        MC.buildings = [];
        MC.locks = [];
        MC.storage = [];

        MC.playerMarkers = [];
        MC.onlinePlayerMarkers = [];
        MC.vehicleMarkers = [];
        MC.buildingMarkers = [];
        MC.lockMarkers = [];
        MC.storageMarkers = [];

        MC.fillDataWindow = fillDataWindow;
        MC.showInfo = false;

        function fillDataWindow(type, id) {
            MC.showInfo = true;

            if(type == 1) {
                MC.selectedKind = "Player";
                MC.csm = MC.players[id];
                MC.spuid = MC.onlinePlayers[id];
            }

            if(type == 2) {
                MC.selectedKind = "Vehicle";
                MC.csm = MC.vehicles[id];
                MC.spuid = "";
            }

            if(type == 3) {
                MC.selectedKind = "Buildable";
                MC.csm = MC.buildings[id];
                MC.spuid = "";
            }

            if(type == 4) {
                MC.selectedKind = "Lockbox";
                MC.csm = MC.locks[id];
                console.log(MC.csm);
                MC.spuid = "";
            }

            if(type == 5) {
                MC.selectedKind = "Storage";
                MC.csm = MC.storage[id];
                MC.spuid = "";
            }





            MC.$apply();
        }

        var repeatOnXAxis = false; // Do we need to repeat the image on the X-axis? Most likely you'll want to set this to false
        var blankTilePath = 'map/altis/empty.png'; // Path to a blank tile when repeat is set to false
        var maxZoom = 5; // Maximum zoom level. Set this to the first number of the last tile generated (eg. 5_31_31 -> 5)
        var allowedBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(70.33956792419954, 178.01171875),
            new google.maps.LatLng(83.86483689701898, -88.033203125)
        );

        function getNormalizedCoord(coord, zoom) {
            if (!repeatOnXAxis) return coord;
            var y = coord.y;
            var x = coord.x;
            var tileRange = 1 << zoom;
            if (y < 0 || y >= tileRange) {
                return null;
            }
            if (x < 0 || x >= tileRange) {
                x = (x % tileRange + tileRange) % tileRange;
            }
            return {
                x: x,
                y: y
            };
        }

        function newMapInit(){
            var customMapType = new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    var normalizedCoord = getNormalizedCoord(coord, zoom);
                    if(normalizedCoord && (normalizedCoord.x < Math.pow(2, zoom)) && (normalizedCoord.x > -1) && (normalizedCoord.y < Math.pow(2, zoom)) && (normalizedCoord.y > -1)) {
                        return 'map/altis/' + zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.png';
                    } else {
                        return blankTilePath;
                    }
                },
                tileSize: new google.maps.Size(256, 256),
                minZoom:2,
                maxZoom: maxZoom,
                name: 'Arma 3 Map'
            });

            // Basic options for our map
            var myOptions = {
                center: new google.maps.LatLng(0, 0),
                zoom: 2,
                minZoom: 0,
                streetViewControl: false,
                mapTypeControl: false,
                mapTypeControlOptions: {
                    mapTypeIds: ["custom"]
                }
            };

            MC.map = new google.maps.Map(document.getElementById('zupa-map'), myOptions);

            MC.map.mapTypes.set('custom', customMapType);
            MC.map.setMapTypeId('custom');

            MC.oms = new OverlappingMarkerSpiderfier( MC.map);

            google.maps.event.addListener(MC.map, 'click', function( event ){
                alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() );
            });
        }




        function removePlayerMarkers(){
            angular.forEach(MC.playerMarkers, function (value, key) {
                MC.oms.removeMarker(value);
                value.setMap(null);

            });
        }

        function removeBuildingMarkers(){
            angular.forEach(MC.buildingMarkers, function (value, key) {
                MC.oms.removeMarker(value);
                value.setMap(null);
            });
        }

        function removeVehicleMarkers(){
            angular.forEach(MC.vehicleMarkers, function (value, key) {
                MC.oms.removeMarker(value);
                value.setMap(null);
            });
        }
        function removeStorageMarkers(){
            angular.forEach(MC.storageMarkers, function (value, key) {
                MC.oms.removeMarker(value);
                value.setMap(null);
            });
        }
        function removeLockMarkers(){
            angular.forEach(MC.lockMarkers, function (value, key) {
                MC.oms.removeMarker(value);
                value.setMap(null);
            });
        }

        function filterLocks(data){
                angular.forEach(data, function (value, key) {
                    if (typeof value !== 'undefined') {
                        if (typeof value[0] !== 'undefined') {
                            if (typeof value[1] !== 'undefined') {
                                if (typeof value[1][0] !== 'undefined') {
                                    if(value[0] != "LockBoxProxy_EPOCH"){
                                        MC.storage.push(value);
                                    }else{
                                        MC.locks.push(value);
                                    }
                                }
                            }
                        }
                    }
                });
            MC.lockCount =  MC.locks.length;
            MC.storageCount =  MC.storage.length;
        }

        function filterVehicles(data){
            angular.forEach(data, function (value, key) {
                if (typeof value !== 'undefined') {
                    if (typeof value[0] !== 'undefined') {
                        if (typeof value[1] !== 'undefined') {
                            if (typeof value[1][0] !== 'undefined') {
                                MC.vehicles.push(value);
                            }
                        }
                    }
                }
            });
            MC.vehicleCount = MC.vehicles.length;
        }

        function filterBuildings(data){
            angular.forEach(data, function (value, key) {
                if (typeof value !== 'undefined') {
                    if (typeof value[0] !== 'undefined') {
                        if (typeof value[1] !== 'undefined') {
                            if (typeof value[1][0] !== 'undefined') {
                                MC.buildings.push(value);
                            }
                        }
                    }
                }
            });
            MC.buildingCount = MC.buildings.length;
        }


        function doAllMarkers() {

            removeBuildingMarkers();
            removeLockMarkers();
            removePlayerMarkers();
            removeStorageMarkers();
            removeVehicleMarkers();

            fillPlayerMarkers();
            fillVehicleMarkers();
            fillBuildingMarkers();
            fillLockMarkers();
            fillStorageMarkers();
        }

        function fillPlayerMarkers() {
            if(MC.showPlayers) {
            angular.forEach(MC.players, function (value, key) {

                var xgame = 0;
                var ygame = 0;

                var continueMarker = false;
                if (typeof value !== 'undefined') {
                    if (typeof value[0] !== 'undefined') {
                        if (typeof value[0][1] !== 'undefined') {
                            xgame = value[0][1][0];
                            ygame = value[0][1][1];

                            continueMarker = true;
                        }
                    }
                }


                if (continueMarker) {

                    var x = MC.x0 + ( xgame * MC.lx );
                    var y = MC.y0 + ( ygame * MC.ly );


                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(y, x),
                        title: "" + value.Name + " - " + value.PUID,
                        icon: RS.imageOnMale,
                        ztype: 1, //player
                        zid: key // index
                    });

                    MC.playerMarkers.push(marker);
                    marker.setMap(MC.map);
                    MC.oms.addMarker(marker);

                    google.maps.event.addListener(marker, 'click', function () {
                        fillDataWindow(marker.ztype, marker.zid);
                    });
                }
            });
        }else{
                removePlayerMarkers();
            }

        }

        function fillVehicleMarkers() {
            if(MC.showVehicles) {
            angular.forEach(MC.vehicles, function (value, key) {

                var xgame = 0;
                var ygame = 0;

                var continueMarker = false;

                if (typeof value !== 'undefined') {

                    if (typeof value[1] !== 'undefined') {

                        if (typeof value[1][0] !== 'undefined') {

                            xgame = value[1][0][0];
                            ygame = value[1][0][1];

                            continueMarker = true;
                        }
                    }
                }

                if (continueMarker) {

                    var x = MC.x0 + ( xgame * MC.lx );
                    var y = MC.y0 + ( ygame * MC.ly );


                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(y, x),
                        title: "" + value.Name + " - " + value.OID,
                        icon: RS.imageCar,
                        ztype: 2, //car
                        zid: key
                    });

                    MC.vehicleMarkers.push(marker);
                    marker.setMap(MC.map);
                    MC.oms.addMarker(marker);


                    google.maps.event.addListener(marker, 'click', function () {
                        fillDataWindow(marker.ztype, marker.zid);
                    });
                }

            });
        }else{
                removeVehicleMarkers();
            }
        }

        function fillBuildingMarkers() {
            if(MC.showBuildings) {
            angular.forEach(MC.buildings, function (value, key) {

                var xgame = 0;
                var ygame = 0;

                var continueMarker = false;

                if (typeof value !== 'undefined') {

                    if (typeof value[1] !== 'undefined') {

                        if (typeof value[1][0] !== 'undefined') {

                            xgame = value[1][0][0];
                            ygame = value[1][0][1];

                            continueMarker = true;
                        }
                    }
                }

                if (continueMarker) {

                    var x = MC.x0 + ( xgame * MC.lx );
                    var y = MC.y0 + ( ygame * MC.ly );


                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(y, x),
                        title: "" + value.Name + " - " + value.OID,
                        icon: RS.imageBuilding,
                        ztype: 3, //car
                        zid: key
                    });

                    MC.buildingMarkers.push(marker);
                    marker.setMap(MC.map);
                    MC.oms.addMarker(marker);

                    google.maps.event.addListener(marker, 'click', function () {
                        fillDataWindow(marker.ztype, marker.zid);
                    });
                }
            });
        }else{
                removeBuildingMarkers();
            }
        }

        function fillLockMarkers(){
            if(MC.showLocks) {
                angular.forEach(MC.locks, function (value, key) {

                    var xgame = 0;
                    var ygame = 0;

                    var continueMarker = false;

                    if (typeof value !== 'undefined') {

                        if (typeof value[1] !== 'undefined') {

                            if (typeof value[1][1] !== 'undefined') {

                                xgame = value[1][1][0];
                                ygame = value[1][1][1];

                                continueMarker = true;
                            }
                        }
                    }

                    if (continueMarker) {

                        var x = MC.x0 + ( xgame * MC.lx );
                        var y = MC.y0 + ( ygame * MC.ly );

                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(y, x),
                            title: "" + value.Name + " - " + value.OID,
                            icon: RS.imageLock,
                            ztype: 4, //car
                            zid: key
                        });

                        MC.lockMarkers.push(marker);
                        marker.setMap(MC.map);
                        MC.oms.addMarker(marker);

                        google.maps.event.addListener(marker, 'click', function () {
                            fillDataWindow(marker.ztype, marker.zid);
                        });
                    }

                });
            }else{
                removeLockMarkers();
            }
     }
        function fillStorageMarkers(){
            if(MC.showStorages) {
                angular.forEach(MC.storage, function (value, key) {

                    var xgame = 0;
                    var ygame = 0;

                    var continueMarker = false;

                    if (typeof value !== 'undefined') {

                        if (typeof value[1] !== 'undefined') {

                            if (typeof value[1][0] !== 'undefined') {

                                xgame = value[1][1][0];
                                ygame = value[1][1][1];

                                continueMarker = true;
                            }
                        }
                    }

                    if (continueMarker) {

                        var x = MC.x0 + ( xgame * MC.lx );
                        var y = MC.y0 + ( ygame * MC.ly );

                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(y, x),
                            title: "" + value.Name + " - " + value.OID,
                            icon: RS.imageStorage,
                            ztype: 5, //car
                            zid: key
                        });

                        MC.storageMarkers.push(marker);
                        marker.setMap(MC.map);
                        MC.oms.addMarker(marker);

                        google.maps.event.addListener(marker, 'click', function () {
                            fillDataWindow(marker.ztype, marker.zid);
                        });
                    }

                });
            }else{
                removeStorageMarkers();
            }
        }

    

	function getOnlinePlayers() {
		
        $http.post(MC.serverURL + 'server/getOnlinePlayers.php?date='+ new Date().getTime(),{secret: String(MC.secretCode) , instance: MC.instance, db : MC.db }).
            success(function(dataOPlayers, status, headers, config) {
                MC.onlinePlayers = dataOPlayers;
                MC.playerCount = MC.onlinePlayers.length;
            }).
            error(function(data, status, headers, config) {
                //    alert("Could not connect to php backend - Online Players");
            });
			}
function getPlayersData() {
        $http.post(MC.serverURL + 'server/getPlayersData.php?date='+ new Date().getTime(),{secret: String(MC.secretCode) , instance: MC.instance, db : MC.db }).
            success(function(dataPlayers, status, headers, config) {
                MC.players = dataPlayers;
                fillPlayerMarkers();
            }).
            error(function(data, status, headers, config) {
                //   alert("Could not connect to php backend - Players Data");
            });
			}
function getVehicleData(){
        $http.post(MC.serverURL + 'server/getVehicleData.php?date='+ new Date().getTime(),{secret: String(MC.secretCode) , instance: MC.instance, db : MC.db }).
            success(function(data, status, headers, config) {
                filterVehicles(data);
                fillVehicleMarkers();
            }).
            error(function(data, status, headers, config) {
                alert("Could not connect to php backend - Vehicles Data");
            });
}
function getBuildingData(){
        $http.post(MC.serverURL + 'server/getBuildingData.php?date='+ new Date().getTime(),{secret: String(MC.secretCode) , instance: MC.instance, db : MC.db }).
            success(function(data, status, headers, config) {
                MC.buildings = data;
                MC.buildingCount = MC.buildings.length;
                fillBuildingMarkers();
            }).
            error(function(data, status, headers, config) {
                //  alert("Could not connect to php backend - Vehicles Data");
            });
}
function getStorageDate(){
        $http.post(MC.serverURL + 'server/getStorageData.php?date='+ new Date().getTime(),{secret: String(MC.secretCode) , instance: MC.instance, db : MC.db }).
            success(function(data, status, headers, config) {

                filterLocks(data);

                fillStorageMarkers();
                fillLockMarkers();
            }).
            error(function(data, status, headers, config) {
                //  alert("Could not connect to php backend - Vehicles Data");
            });
			}
			
		newMapInit();
		getStorageDate();
		getBuildingData();
		getVehicleData();
		getPlayersData();
		getOnlinePlayers();
    });
