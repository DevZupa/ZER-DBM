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

        MC.serverURL = RS.selectedServer['serverUrl'];
	    MC.mapName = RS.selectedServer['map'];

		MC.secretCode = CryptoJS.MD5(RS.selectedServer['rpw']);
	
		MC.instance = RS.selectedServer['ri'];
	    MC.db = RS.selectedServer['dbi'];

        MC.mapsizeX = 0;
        MC.mapsizeY = 0;

        angular.forEach(RS.maps, function(value, key) {
           if( value.name == MC.mapName){
               MC.mapsizeX = value.x;
               MC.mapsizeY = value.y;
           }
        });



        MC.leafletsize = 8192;


        MC.csm = [];
        MC.spuid = "";
        MC.selectedKind = "Player";

        MC.togleSettings = true;

        MC.clusterPlayer = false;
        MC.clusterVehicle = false;
        MC.clusterBuilding = true;
        MC.clusterLock = false;
        MC.clusterStorage = false;

        MC.clusterAllTogether = false;
        MC.clusterRadius = RS.clusterRad;

        storage.bind(MC, 'clusterAllTogether', {defaultValue: false});
        storage.bind(MC, 'clusterRadius', {defaultValue: 30});

        storage.bind(MC, 'showPlayers', {defaultValue: true});
        storage.bind(MC, 'showVehicles', {defaultValue: false});
        storage.bind(MC, 'showBuildings', {defaultValue: false});
        storage.bind(MC, 'showLocks', {defaultValue: false});
        storage.bind(MC, 'showStorages', {defaultValue: false});


        storage.bind(MC, 'clusterPlayer', {defaultValue: false});
        storage.bind(MC, 'clusterVehicle', {defaultValue: false});
        storage.bind(MC, 'clusterBuilding', {defaultValue: true});
        storage.bind(MC, 'clusterLock', {defaultValue: false});
        storage.bind(MC, 'clusterStorage', {defaultValue: false});



        MC.$watch("clusterAllTogether", function(newValue, oldValue) {
            doAllMarkers();
        });

        MC.$watch("clusterPlayer", function(newValue, oldValue) {
            doAllMarkers();
        });
        MC.$watch("clusterVehicle", function(newValue, oldValue) {
            doAllMarkers();
        });
        MC.$watch("clusterBuilding", function(newValue, oldValue) {
            doAllMarkers();
        });
        MC.$watch("clusterLock", function(newValue, oldValue) {
            doAllMarkers();
        });
        MC.$watch("clusterStorage", function(newValue, oldValue) {
            doAllMarkers();
        });

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

        MC.allMarkersToCluster = [];

        MC.playerLayer = null;
        MC.vehicleLayer = null;
        MC.buildingLayer = null;
        MC.lockLayer = null;
        MC.storageLayer = null;

        MC.globalLayer = null;

        MC.fillDataWindow = fillDataWindow;
        MC.showInfo = false;


        MC.buildingIcon = L.icon({
            iconUrl: 'images/walls.png',
            iconRetinaUrl: 'images/walls.png',
            iconSize:[32,37],
            iconAnchor: [16,37]
        });

        MC.doorIcon = L.icon({
            iconUrl: 'images/door.png',
            iconRetinaUrl: 'images/door.png',
            iconSize:[32,37],
            iconAnchor: [16,37]
        });

        MC.heliIcon = L.icon({
            iconUrl: 'images/heli.png',
            iconRetinaUrl: 'images/heli.png',
            iconSize:[32,37],
            iconAnchor: [16,37]
        });

        MC.shipIcon = L.icon({
            iconUrl: 'images/ship.png',
            iconRetinaUrl: 'images/ship.png',
            iconSize:[32,37],
            iconAnchor: [16,37]
        });

        MC.storageIcon = L.icon({
            iconUrl: 'images/storage.png',
            iconRetinaUrl: 'images/storage.png',
            iconSize:[32,37],
            iconAnchor: [16,37]
        });


        MC.lockIcon = L.icon({
            iconUrl: 'images/lock.png',
            iconRetinaUrl: 'images/lock.png',
            iconSize:[32,37],
            iconAnchor: [16,37]
        });

        MC.atmIcon = L.icon({
            iconUrl: 'images/atm.png',
            iconRetinaUrl: 'images/atm.png',
            iconSize:[32,37],
            iconAnchor: [16,37]
        });

        MC.carIcon = L.icon({
            iconUrl: 'images/car.png',
            iconRetinaUrl: 'images/car.png',
            iconSize:[32,37],
            iconAnchor: [16,37]
        });

        MC.maleIcon = L.icon({
            iconUrl: 'images/male.png',
            iconRetinaUrl: 'images/male.png',
            iconSize:[32,37],
            iconAnchor: [16,37]
        });

        MC.femaleIcon = L.icon({
            iconUrl: 'images/female.png',
            iconRetinaUrl: 'images/female.png',
            iconSize:[32,37],
            iconAnchor: [16,37]
        });

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


        function init() {
            var mapMinZoom = 0;
            var mapMaxZoom = 5;
            MC.map = L.map('zupa-map', {
                maxZoom: mapMaxZoom,
                minZoom: mapMinZoom,
                crs: L.CRS.Simple
            }).setView([0, 0], mapMaxZoom);

            var mapBounds = new L.LatLngBounds(
                MC.map.unproject([0, 8192], mapMaxZoom),
                MC.map.unproject([8192, 0], mapMaxZoom));

            MC.map.fitBounds(mapBounds);
            L.tileLayer('map/'+MC.mapName+'/{z}/{x}/{y}.png', {
                minZoom: mapMinZoom, maxZoom: mapMaxZoom,
                bounds: mapBounds,
                attribution: 'Zupa',
                noWrap: true
            }).addTo(  MC.map);

        }

        function removePlayerMarkers(){
            angular.forEach(MC.playerMarkers, function (value, key) {
                MC.map.removeLayer(value);
            });
            if( MC.playerLayer != null)
            {
                MC.playerLayer.clearLayers();
            }
        }

        function removeBuildingMarkers(){
            angular.forEach(MC.buildingMarkers, function (value, key) {
                MC.map.removeLayer(value);
            });

            if( MC.buildingLayer != null)
            {
                MC.buildingLayer.clearLayers();
            }
        }

        function removeVehicleMarkers(){
            angular.forEach(MC.vehicleMarkers, function (value, key) {
                MC.map.removeLayer(value);
            });

            if( MC.vehicleLayer != null)
            {
                MC.vehicleLayer.clearLayers();
            }
        }
        function removeStorageMarkers(){
            angular.forEach(MC.storageMarkers, function (value, key) {
                MC.map.removeLayer(value);
            });
            if( MC.storageLayer != null)
            {
                MC.storageLayer.clearLayers();
            }
        }
        function removeLockMarkers(){
            angular.forEach(MC.lockMarkers, function (value, key) {
                MC.map.removeLayer(value);
            });
            if( MC.lockLayer != null)
            {
                MC.lockLayer.clearLayers();
            }
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

            removeGlobalCluster();

            MC.playerMarkers = [];
            MC.onlinePlayerMarkers = [];
            MC.vehicleMarkers = [];
            MC.buildingMarkers = [];
            MC.lockMarkers = [];
            MC.storageMarkers = [];

            fillPlayerMarkers();
            fillVehicleMarkers();
            fillBuildingMarkers();
            fillLockMarkers();
            fillStorageMarkers();
        }

        function  removeGlobalCluster() {
           //TODO  MC.map.removeLayer(MC.allMarkersToCluster);

            MC.allMarkersToCluster = [];
            if( MC.globalLayer != null)
            {
                MC.globalLayer.clearLayers();
            }
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

                    var x = xgame / MC.mapsizeX * MC.leafletsize ;
                    var y = MC.leafletsize - (ygame / MC.mapsizeY * MC.leafletsize);

                    var marker = null;
                    if( JSON.stringify(value).indexOf("Epoch_Male_F") > -1) {
                         marker = L.marker(MC.map.unproject([x, y],MC.map.getMaxZoom()),{icon: MC.maleIcon});
                    }else{
                         marker = L.marker(MC.map.unproject([x, y],MC.map.getMaxZoom()),{icon: MC.femaleIcon});
                    }
                    MC.playerMarkers.push(marker);

                    var popupContent = '<div>' +
                        '' + JSON.stringify(value) +
                        '</div>'

                    marker.bindPopup(popupContent);
                    if (!MC.clustervehicle) {
                          marker.addTo(MC.map);
                    };

                }
            });
                if (MC.clusterPlayer && !MC.clusterAllTogether) {
                    MC.playerLayer = L.markerClusterGroup({chunkedLoading: true, maxClusterRadius : MC.clusterRadius});
                    MC.playerLayer.addLayers(MC.playerMarkers);
                    MC.map.addLayer(  MC.playerLayer);
                }

                if( MC.clusterAllTogether && MC.clusterPlayer ){
                    MC.allMarkersToCluster = MC.allMarkersToCluster.concat( MC.playerMarkers);
                }
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

                    var x = xgame / MC.mapsizeX * MC.leafletsize ;
                    var y = MC.leafletsize - (ygame / MC.mapsizeY * MC.leafletsize);

                    var marker = null;

                    if(value[0].indexOf("heli") > -1 || value[0].indexOf("mosquito") > -1 || value[0].indexOf("Heli") > -1)
                    {
                        marker = L.marker(MC.map.unproject([x, y],MC.map.getMaxZoom()),{icon: MC.heliIcon});
                    }else{
                        if(value[0].indexOf("boat") > -1 || value[0].indexOf("Boat") > -1 || value[0].indexOf("Ship") > -1 || value[0].indexOf("ship") > -1 || value[0].indexOf("jetski") > -1)
                        {
                            marker = L.marker(MC.map.unproject([x, y],MC.map.getMaxZoom()),{icon: MC.shipIcon});
                        }else {
                            marker = L.marker(MC.map.unproject([x, y], MC.map.getMaxZoom()), {icon: MC.carIcon});
                        }
                    }



                    MC.vehicleMarkers.push(marker);

                    var popupContent = '<div>' +
                        '' + JSON.stringify(value) +
                        '</div>'

                    marker.bindPopup(popupContent);
                    if (!MC.clusterVehicle) {
                         marker.addTo(MC.map);
                    }

                }

            });
                if (MC.clusterVehicle && !MC.clusterAllTogether) {
                    MC.vehicleLayer = L.markerClusterGroup({chunkedLoading: true, maxClusterRadius : MC.clusterRadius});
                    MC.vehicleLayer.addLayers(MC.vehicleMarkers);
                    MC.map.addLayer(MC.vehicleLayer);
                }

                if( MC.clusterAllTogether && MC.clusterVehicle){
                    MC.allMarkersToCluster = MC.allMarkersToCluster.concat( MC.vehicleMarkers);
                }

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

                    var x = xgame / MC.mapsizeX * MC.leafletsize ;
                    var y = MC.leafletsize - (ygame / MC.mapsizeY * MC.leafletsize);

                    var marker = null;
                    if(value[0].indexOf("door") > -1 || value[0].indexOf("Door") > -1 || value[0].indexOf("garage") > -1 || value[0].indexOf("Garage") > -1) {
                        marker = L.marker(MC.map.unproject([x, y], MC.map.getMaxZoom()), {icon: MC.doorIcon});
                    }else{
                        marker = L.marker(MC.map.unproject([x, y], MC.map.getMaxZoom()), {icon: MC.buildingIcon});
                    }

                    MC.buildingMarkers.push(marker);

                    var popupContent = '<div>' +
                        '' + JSON.stringify(value) +
                        '</div>'

                    marker.bindPopup(popupContent);
                    if (!MC.clusterBuilding) {
                          marker.addTo(MC.map);
                    }


/*
                    google.maps.event.addListener(marker, 'click', function () {
                        fillDataWindow(marker.ztype, marker.zid);
                    });
                    */
                }
            });
                if (MC.clusterBuilding && !MC.clusterAllTogether) {
                    MC.buildingLayer = L.markerClusterGroup({chunkedLoading: true, maxClusterRadius : MC.clusterRadius});
                    MC.buildingLayer.addLayers(MC.buildingMarkers);
                    MC.map.addLayer( MC.buildingLayer);
                }
                if( MC.clusterAllTogether && MC.clusterBuilding ){
                    MC.allMarkersToCluster = MC.allMarkersToCluster.concat( MC.buildingMarkers);
                }
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

                        var x = xgame / MC.mapsizeX * MC.leafletsize;
                        var y = MC.leafletsize - (ygame / MC.mapsizeY * MC.leafletsize);


                        var marker = L.marker(MC.map.unproject([x, y], MC.map.getMaxZoom()), {icon: MC.lockIcon});

                        MC.lockMarkers.push(marker);

                        var popupContent = '<div>' +
                            '' + JSON.stringify(value) +
                            '</div>'

                        marker.bindPopup(popupContent);

                        if (!MC.clusterLock){
                            marker.addTo(MC.map);
                        }

                    }

                });
                if (MC.clusterLock && !MC.clusterAllTogether) {
                    MC.lockLayer = L.markerClusterGroup({chunkedLoading: true, maxClusterRadius : MC.clusterRadius});
                    MC.lockLayer.addLayers(MC.lockMarkers);
                    MC.map.addLayer(MC.lockLayer);
                }

                if( MC.clusterAllTogether && MC.clusterLock){
                    MC.allMarkersToCluster = MC.allMarkersToCluster.concat( MC.lockMarkers);
                }
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

                        var x = xgame / MC.mapsizeX * MC.leafletsize ;
                        var y = MC.leafletsize - (ygame / MC.mapsizeY * MC.leafletsize);


                        var marker = L.marker(MC.map.unproject([x, y],MC.map.getMaxZoom()),{icon: MC.storageIcon});

                        MC.storageMarkers.push(marker);

                        var popupContent = '<div>' +
                            '' + JSON.stringify(value) +
                            '</div>'

                        marker.bindPopup(popupContent);


                        if(!MC.clusterStorage) {
                             marker.addTo(MC.map);
                        }

                    }

                });
                if(MC.clusterStorage &&  !MC.clusterAllTogether) {
                    MC.storageLayer = L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius : MC.clusterRadius});
                    MC.storageLayer.addLayers(MC.storageMarkers);
                    MC.map.addLayer(MC.storageLayer);
                }

                if( MC.clusterAllTogether && MC.clusterStorage){
                    MC.allMarkersToCluster = MC.allMarkersToCluster.concat( MC.storageMarkers);
                }

            }else{
                removeStorageMarkers();
            }
        }

    

	function getOnlinePlayers() {
		
        $http.post(MC.serverURL + 'getOnlinePlayers.php?date='+ new Date().getTime(),{secret: String(MC.secretCode) , instance: MC.instance, db : MC.db }).
            success(function(dataOPlayers, status, headers, config) {
                MC.onlinePlayers = dataOPlayers;
                MC.playerCount = MC.onlinePlayers.length;
            }).
            error(function(data, status, headers, config) {
                //    alert("Could not connect to php backend - Online Players");
            });
			}
function getPlayersData() {
        $http.post(MC.serverURL + 'getPlayersData.php?date='+ new Date().getTime(),{secret: String(MC.secretCode) , instance: MC.instance, db : MC.db }).
            success(function(dataPlayers, status, headers, config) {
                MC.players = dataPlayers;
                fillPlayerMarkers();
            }).
            error(function(data, status, headers, config) {
                //   alert("Could not connect to php backend - Players Data");
            });
			}
function getVehicleData(){
        $http.post(MC.serverURL + 'getVehicleData.php?date='+ new Date().getTime(),{secret: String(MC.secretCode) , instance: MC.instance, db : MC.db }).
            success(function(data, status, headers, config) {
                filterVehicles(data);
                fillVehicleMarkers();
            }).
            error(function(data, status, headers, config) {
               // alert("Could not connect to php backend - Vehicles Data");
            });
}
function getBuildingData(){
        $http.post(MC.serverURL + 'getBuildingData.php?date='+ new Date().getTime(),{"secret": String(MC.secretCode) , "instance": MC.instance, "db" : MC.db }).
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
        $http.post(MC.serverURL + 'getStorageData.php?date='+ new Date().getTime(),{secret: String(MC.secretCode) , instance: MC.instance, db : MC.db }).
            success(function(data, status, headers, config) {

                filterLocks(data);

                fillStorageMarkers();
                fillLockMarkers();
            }).
            error(function(data, status, headers, config) {
                //  alert("Could not connect to php backend - Vehicles Data");
            });
			}

        init();
		getStorageDate();
		getBuildingData();
		getVehicleData();
		getPlayersData();
		getOnlinePlayers();
    });
