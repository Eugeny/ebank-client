angular.module('directives')
    .controller('leftMenuCtrl', ['$scope', '$rootScope', 'customEvents',
        function($scope, $rootScope, customEvents) {
            'use strict';

            function activate() {
                $rootScope.$on(customEvents.leftMenu.closeLeftMenu, function() {
                    $scope.close();
                });
            }

            $scope.isOpen = $scope.isOpen || false;

            $scope.close = function() {
                $scope.isOpen = false;
            };

            activate();
        }]);