'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ERDBM
 */
angular.module('ERDBM')
  .controller('AuthCtrl',['$scope' , '$http', '$rootScope' , function ($scope, $http, $rootScope) {




        $scope.isLoading = false;


        $scope.login = $rootScope.credentials;

        $scope.doLogin = function (customer) {
            $scope.isLoading = true;

            $http.post(MC.serverURL + 'login?token=' + login.token + '&date=' + new Date().getTime(),{secret: String(MC.secretCode) , instance: MC.instance, db : MC.db }).
                success(function(data, status, headers, config) {
                    console.log(data);


                    $scope.isLoading = false;                }).
                error(function(data, status, headers, config) {
                    alert('Could not reach the server correctly.');
                    $scope.isLoading = false;
                });


        };

  }]);
