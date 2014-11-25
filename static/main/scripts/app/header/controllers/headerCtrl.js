angular.module('ebank-client')
    .controller('headerCtrl', ['$scope', 'userInfoService', 'notificationsInfoService',
        function($scope, userInfoService, notificationsInfoService) {
            'use strict';

            $scope.userInfoService = userInfoService;
            $scope.notificationsInfoService = notificationsInfoService;

            $scope.isLeftMenuOpen = false;

            $scope.getUnreadNotificationsCount = function() {
                return _.where(notificationsInfoService.currentNotificationsInfo,
                            {
                                unread: true
                            }).length;
            };

            $scope.toggleLeftMenu = function() {
                $scope.isLeftMenuOpen = !$scope.isLeftMenuOpen;
            };

            $scope.logOut = function() {
                userInfoService.logoutUser();
            };
        }]);