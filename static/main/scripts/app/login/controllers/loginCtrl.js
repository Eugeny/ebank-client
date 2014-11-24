angular.module('ebank-client')
    .controller('loginCtrl', ['$scope', '$rootScope', 'userInfoService', 'customEvents', 'userNotificationService', 'gettext',
        function($scope, $rootScope, userInfoService, customEvents, userNotificationService, gettext) {
            'use strict';

            function activate() {
                clearForm();
            }

            function clearForm() {
                $scope.login = '';
                $scope.password = '';
            }

            function setAllInputsDirty(scope) {
                _.each(scope, function(value, key) {
                    // We skip non-form and non-inputs
                    if (!value || value.$dirty === undefined) {
                        return;
                    }

                    // Recursively applying same method on all forms included in the form
                    if (value.$addControl) {
                        return setAllInputsDirty(value);
                    }

                    // Setting inputs to $dirty, but re-applying its content in itself
                    if (value.$setViewValue) {
                        return value.$setViewValue(value.$viewValue);
                    }
                });
            }

            $scope.isBusy = false;

            $scope.loginUser = function() {
                $scope.isBusy = true;

                if ($scope.loginForm.$valid) {
                    userInfoService.loginUser($scope.login, $scope.password)
                        .then(function(result) {
                            $rootScope.$emit(customEvents.general.logIn);
                        }, function(error) {
                            console.log(error.data.message);

                            userNotificationService.showError(gettext('Login or password are incorrect, please try again'));

                            clearForm();
                            $scope.isBusy = false;
                        });
                } else {
                    $scope.isBusy = false;
                }
            };

            $scope.loginUserButtonClick = function() {
                setAllInputsDirty($scope);
            };

            activate();
        }]);