angular.module('ebank-client')
    .controller('loginCtrl', ['$scope',
        function($scope) {
            'use strict';

            function activate() {
                clearForm();
            }

            function clearForm() {
                $scope.login = '';
                $scope.password = '';
            }

            activate();
        }]);