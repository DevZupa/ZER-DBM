'use strict';

/**
 * @ngdoc function
 * @name ERDBM.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ERDBM
 */
ERDBM
  .controller('AuthCtrl',["$scope", function ($scope) {


        $scope.login = {};
        $scope.signup = {};
        $scope.doLogin = function (customer) {
            Data.post('login', {
                customer: customer
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    $location.path('dashboard');
                }
            });
        };
        $scope.signup = {email:'',password:'',name:'',phone:'',address:''};
        $scope.signUp = function (customer) {
            Data.post('signUp', {
                customer: customer
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    $location.path('dashboard');
                }
            });
        };
        $scope.logout = function () {
            Data.get('logout').then(function (results) {
                Data.toast(results);
                $location.path('login');
            });
        }



  }]);
