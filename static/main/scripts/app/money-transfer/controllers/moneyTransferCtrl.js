angular.module('ebank-client')
    .controller('moneyTransferCtrl', ['$scope', 'userAccountsProvider', 'validationRegularExpressions',
            'paymentsService', 'userNotificationService',
        function($scope, userAccountsProvider, validationRegularExpressions, paymentsService,
                userNotificationService) {
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
                $scope.currentPayment = {};

                $scope.currentUserAccount = null;
                $scope.paymentAmount = 1;
            }

            $scope.validationRegularExpressions = validationRegularExpressions;
            $scope.isBusy = false;
            $scope.userAccounts = null;

            $scope.pay = function() {
                $scope.isBusy = true;

                paymentsService.payGenericPayment(
                    angular.extend($scope.currentPayment, {
                        accountNumber: $scope.currentUserAccount.id,
                        amount: $scope.paymentAmount
                    })).then(function (result) {
                        userNotificationService.showSuccess('Money successfully transfered');

                        clearForm();
                        updateAccountsInfo();
                    }, function (error) {
                        userNotificationService.showError('An error occured during money transfering process');
                    }).finally(function() {
                        $scope.isBusy = false;
                    });
            };

            activate();
        }]);