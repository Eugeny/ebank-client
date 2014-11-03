angular.module('ebank-client')
    .controller('paymentsCtrl', ['$scope', 'userAccountsProvider', 'validationRegularExpressions',
        function($scope, userAccountsProvider, validationRegularExpressions) {
            'use strict';

            function activate() {
                clearForm();
                updateAccountsInfo();
            }

            function updateAccountsInfo() {
                $scope.isBusy = true;

                userAccountsProvider.getAccounts()
                    .then(function(accounts) {
                        $scope.userAccounts = accounts;

                        if ($scope.userAccounts.length) {
                            $scope.currentUserAccount = $scope.userAccounts[0];
                        }
                    }, function(error) {
                        console.log(error);
                    }).finally(function() {
                        $scope.isBusy = false;
                    });
            }

            function clearForm() {
                $scope.paymentForm = null;
                $scope.currentPayment = null;
                $scope.currentPaymentFields = null;

                $scope.currentUserAccount = null;
                $scope.paymentAmount = 1;
            }

            $scope.validationRegularExpressions = validationRegularExpressions;
            $scope.isBusy = false;
            $scope.userAccounts = null;

            $scope.pay = function() {
                //TODO: post payment query
                console.log($scope.currentPayment, $scope.currentPaymentFields);

                clearForm();
                updateAccountsInfo();
            }

            activate();
        }]);