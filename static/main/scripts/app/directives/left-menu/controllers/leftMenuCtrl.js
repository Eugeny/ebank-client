angular.module('directives')
    .controller('leftMenuCtrl', ['$scope',
        function($scope) {
            'use strict';

            $scope.isOpen = $scope.isOpen || false;

            $scope.close = function() {
                $scope.isOpen = false;
            };
        }]);