angular.module('ebank-client')
    .controller('paymentsCtrl', ['$scope', 'userAccountsProvider', 'validationRegularExpressions',
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
                $scope.currentPayment = null;
                $scope.currentPaymentFields = null;

                $scope.currentUserAccount = null;
                $scope.paymentAmount = 1;
            }

            $scope.validationRegularExpressions = validationRegularExpressions;
            $scope.isBusy = false;
            $scope.userAccounts = null;

            $scope.pay = function() {
                $scope.isBusy = true;

                paymentsService.payEripPayment({
                    accountNumber: $scope.currentUserAccount.id,
                    paymentId: $scope.currentPayment.paymentId,
                    paymentFields: $scope.currentPaymentFields,
                    amount: $scope.paymentAmount
                }).then(function (result) {
                    userNotificationService.showSuccess('Payment successfully done');

                    clearForm();
                    updateAccountsInfo();
                }, function (error) {
                    userNotificationService.showError('An error occured during payment process');
                }).finally(function() {
                    $scope.isBusy = false;
                });
            };

            activate();
        }]);