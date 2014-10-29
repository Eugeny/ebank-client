angular.module('ebank-client')
    .controller('headerCtrl', ['$scope', '$rootScope', 'userInfoService', 'notificationsInfoService', 'customEvents',
        function($scope, $rootScope, userInfoService, notificationsInfoService, customEvents) {
            'use strict';

            $scope.userInfoService = userInfoService;
            $scope.notificationsInfoService = notificationsInfoService;

            $scope.isLeftMenuOpen = false;

            $scope.toggleLeftMenu = function() {
                $scope.isLeftMenuOpen = !$scope.isLeftMenuOpen;
            };

            $scope.logOut = function() {
                $rootScope.$emit(customEvents.general.logOut);
            };
        }]);