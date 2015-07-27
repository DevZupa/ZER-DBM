'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:DeathlogsCtrl
 * @description
 * # DeathlogsCtrl
 * Controller of the ERDBM
 */
ERDBM.controller('DeathlogsCtrl', ["$scope","storage","$route","$rootScope", function ($scope,storage,$route,$rootScope) {

    var DC = $scope;

    // $(".nav li").removeClass("active");
    //
    // $("#deathlogs").addClass("active");
    //
    // DC.pageSizeDefault = 10;
    //
    // storage.bind(DC,'pageSizeDeaths',{defaultValue:  DC.pageSizeDefault });
    //
    // DC.deaths = new kendo.data.ObservableArray([
    //     { "Victim" : "Zupa" , "Killer" : "Shane" , "Date": "2014-10-30 16:19:00", "Weapon": "Carhorn"},
    //     { "Victim" : "Shane" , "Killer" : "Zupa" , "Date": "2014-10-30 16:20:00", "Weapon": "Carhorn"},
    //
    // ]);
    //
    // DC.mainGridOptions = {
    //     dataSource: {
    //         data: DC.deaths,
    //         schema: {
    //             model: {
    //                 fields: {
    //                     Victim: { type: "string" },
    //                     Killer: { type: "string" },
    //                     Date: { type: "date" },
    //                     Weapon: { type: "string" }
    //                 }
    //             }
    //         },
    //         pageSize:  DC.pageSizeDeaths
    //     },
    //
    //     scrollable: true,
    //     sortable: true,
    //     filterable: true,
    //     pageable: {
    //         input: false,
    //         numeric: true
    //     },
    //     columns: [
    //         "Victim",
    //         'Killer',
    //         'Date',
    //         'Weapon'
    //     ]
    // };
    //
    // DC.changePageSize = changePageSize;
    //
    // function changePageSize(){
    //     $route.reload();
    // }







}]);
