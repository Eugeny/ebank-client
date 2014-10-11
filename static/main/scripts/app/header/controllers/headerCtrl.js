angular.module('ebank-client')
    .controller('headerCtrl', ['$scope', 'userInfoService', 'notificationsInfoService',
        function($scope, userInfoService, notificationsInfoService) {
            'use strict';

            $scope.userInfoService = userInfoService;
            $scope.notificationsInfoService = notificationsInfoService;
        }]);