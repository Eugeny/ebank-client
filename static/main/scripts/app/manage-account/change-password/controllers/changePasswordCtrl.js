angular.module('ebank-client')
    .controller('manageAccount.changePasswordCtrl',
        ['$scope', '$rootScope', '$http', 'validationRegularExpressions', 'endpointGenerationService',
            'userNotificationService', 'confirmationPopup', 'gettext',
        function($scope, $rootScope, $http, validationRegularExpressions, endpointGenerationService,
                userNotificationService, confirmationPopup, gettext) {
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
                    confirmationPopup.open(function() {//OK callback
                        $http(endpointGenerationService.getPostChangeUserPasswordEndpoint({
                            client_id_to_change: $scope.login,
                            old_password: $scope.password,
                            new_password: $scope.newPassword
                        })).then(function(result) {
                            if (result.data.error) {
                                userNotificationService.showError(result.data.error.message
                                    || $rootScope.gettext('Oops, an error occurred, please try again'));
                            } else {
                                userNotificationService.showSuccess(
                                    $rootScope.gettext('The password was successfully changed'));
                            }
                        }, function(error) {
                            var message = "An error occurred during password change process";
                            
                            //the old password is not correct
                            if (error.status === 403) {
                                message = "Authentication failed";
                            }

                            userNotificationService.showError(message
                                || $rootScope.gettext('Oops, an error occurred, please try again'));
                        }).finally(function() {
                            clearForm();
                        });
                    }, function() {});
                }
            };

            activate();
        }]);