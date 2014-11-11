angular.module('ebank-client')
    .controller('headerCtrl', ['$scope', 'userInfoService', 'notificationsInfoService',
        function($scope, userInfoService, notificationsInfoService) {
            'use strict';

            $scope.userInfoService = userInfoService;
            $scope.notificationsInfoService = notificationsInfoService;

            $scope.isLeftMenuOpen = false;

            $scope.toggleLeftMenu = function() {
                $scope.isLeftMenuOpen = !$scope.isLeftMenuOpen;
            };

            $scope.logOut = function() {
                userInfoService.logoutUser();
            };
        }]);