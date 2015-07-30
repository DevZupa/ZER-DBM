'use strict';

/**
 * @ngdoc function
 * @name zepochRedisApp.controller:AdminlogsCtrl
 * @description
 * # AdminlogsCtrl
 * Controller of the zepochRedisApp
 */
ERDBM
  .controller('AdminlogsCtrl',["$scope","storage","$route", function ($scope,storage,$route) {

        var AC = $scope;

        $(".nav li").removeClass("active");

        $("#adminlogs").addClass("active");

        AC.pageSizeDefault = 10;

        storage.bind(AC,'pageSizeAdmin',{defaultValue:  AC.pageSizeDefault });

        AC.adminActions = new kendo.data.ObservableArray([
            { "PUID" : "76561198012464696" , "Name" : "Zupa" , "Date": "2014-12-02 19:14:04", "Action": " [ -ON-] Map to Teleport"},
            { "PUID" : "76561198012464696" , "Name" : "Zupa" , "Date": "2014-12-02 19:14:08", "Action": " [ -OFF-] Map to Teleport"},
        ]);

        AC.mainGridOptions = {
            dataSource: {
                data: AC.adminActions,
                schema: {
                    model: {
                        fields: {
                            PUID: { type: "string" },
                            Name: { type: "string" },
                            Date: { type: "date" },
                            Action: { type: "string" }
                        }
                    }
                },
                pageSize:  AC.pageSizeAdmin
            },

            scrollable: true,
            sortable: true,
            filterable: true,
            pageable: {
                input: false,
                numeric: true
            },
            columns: [
                "Date",
                'Name',
                'PUID',
                'Action'
            ]
        };

        AC.changePageSize = changePageSize;

        function changePageSize(){
            $route.reload();
        }




    }]);
