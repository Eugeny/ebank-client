angular.module('ebank-client')
    .controller('manageAccount.changePasswordCtrl',
        ['$scope', '$http', 'validationRegularExpressions', 'endpointGenerationService',
            'userNotificationService',
        function($scope, $http, validationRegularExpressions, endpointGenerationService,
                userNotificationService) {
            'use strict';

            function activate() {
                clearForm();
            }

            function clearForm() {
                $scope.login = '';
                $scope.password = '';
                $scope.newPassword = '';
                $scope.confirmNewPassword = '';
            }

            $scope.validationRegularExpressions = validationRegularExpressions;

            $scope.changePassword = function() {
                $http(endpointGenerationService.getPostChangeUserPasswordEndpoint({
                    client_id: $scope.login,
                    old_password: $scope.password,
                    new_password: $scope.newPassword
                })).then(function(data) {
                    userNotificationService.showSuccess('The password is successfully changed');
                }, function(error) {
                    userNotificationService.showSuccess(error);
                }).finally(function() {
                    clearForm();
                });
            };

            activate();
        }]);