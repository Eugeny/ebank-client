angular.module('ebank-client')
    .controller('manageAccount.changePasswordCtrl',
        ['$scope', '$http', 'validationRegularExpressions', 'endpointGenerationService',
            'userNotificationService', 'gettext',
        function($scope, $http, validationRegularExpressions, endpointGenerationService,
                userNotificationService, gettext) {
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
                if ($scope.changePasswordForm.$valid) {
                    $http(endpointGenerationService.getPostChangeUserPasswordEndpoint({
                        client_id_to_change: $scope.login,
                        old_password: $scope.password,
                        new_password: $scope.newPassword
                    })).then(function(result) {
                        if (result.data.error) {
                            userNotificationService.showError(result.data.error.message || 'Oops, an error occurred, please try again');
                        } else {
                            userNotificationService.showSuccess(gettext('The password was successfully changed'));
                        }
                    }, function(error) {
                        var message = "An error occurred during password change process";
                        
                        //the old password is not correct
                        if (error.status === 403) {
                            message = "Authentication failed";
                        }

                        userNotificationService.showError(message || 'Oops, an error occurred, please try again');
                    }).finally(function() {
                        clearForm();
                    });
                }
            };

            activate();
        }]);