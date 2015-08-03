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

        if(!$scope.login.remember) {
            $scope.login.token = '';
            $scope.login.name = '';
            $scope.login.password = '';
        }

        $scope.serverUrl = 'http://jarysdp.be.dev/laravel/public/index.php/';


        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        $scope.doLogin = function () {
            console.log('test');
            $scope.isLoading = true;

            console.log($scope.login);

            $http.post($scope.serverUrl + 'login?date=' + new Date().getTime(), { name : $scope.login.name , password : $scope.login.password}).
                success(function(data, status, headers, config) {
                    console.log(data);

                    $scope.isLoading = false;                }).
                error(function(data, status, headers, config) {
                    alert('Could not reach the server correctly.');
                    $scope.isLoading = false;
                });

        };

  }]);
