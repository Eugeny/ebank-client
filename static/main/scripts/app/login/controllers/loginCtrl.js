angular.module('ebank-client')
    .controller('loginCtrl', ['$scope', '$rootScope', 'userInfoService', 'customEvents', 'userNotificationService',
        function($scope, $rootScope, userInfoService, customEvents, userNotificationService) {
            'use strict';

            function activate() {
                clearForm();
            }

            function clearForm() {
                $scope.login = '';
                $scope.password = '';
            }

            $scope.isBusy = false;

            $scope.loginUser = function() {
                $scope.isBusy = true;

                userInfoService.loginUser($scope.login, $scope.password)
                    .then(function(result) {
                        $rootScope.$emit(customEvents.general.logIn);
                    }, function(error) {
                        console.log(error.data.message);

                        userNotificationService.showError('Login or Password are incorrect, please try again');

                        clearForm();
                    }).finally(function() {
                        $scope.isBusy = false;
                    });
            };

            activate();
        }]);