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
                })).then(function(result) {
                    if (result.data.error) {
                        userNotificationService.showError(result.data.error.message);
                    } else {
                        userNotificationService.showSuccess('The password successfully changed');
                    }
                }, function(error) {
                    var message = "An error occurred during password change process";
                    
                    //the old password is not correct
                    if (error.status === 403) {
                        message = "Authentication failed";
                    }

                    userNotificationService.showError(message);
                }).finally(function() {
                    clearForm();
                });
            };

            activate();
        }]);