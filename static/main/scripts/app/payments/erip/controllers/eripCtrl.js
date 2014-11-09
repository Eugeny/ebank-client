angular.module('ebank-client')
    .controller('payments.eripCtrl', ['$scope', '$modal', 'userAccountsProvider', 'validationRegularExpressions',
            'paymentsService', 'userNotificationService',
        function($scope, $modal, userAccountsProvider, validationRegularExpressions, paymentsService,
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

            function openPaymentResultModal(paymentResult) {
                return $modal.open({
                    templateUrl: '/static/main/scripts/app/payments/views/paymentResult.html',
                    controller: 'payments.paymentResultCtrl',
                    size: 'lg',
                    windowClass: 'payment-result-modal',
                    resolve: {
                        paymentResult: function() {
                            return paymentResult;
                        }
                    }
                });
            }

            $scope.validationRegularExpressions = validationRegularExpressions;
            $scope.isBusy = false;
            $scope.userAccounts = null;

            $scope.pay = function() {
                $scope.isBusy = true;
                var currentPayment = {
                    accountNumber: $scope.currentUserAccount.id,
                    paymentId: $scope.currentPayment.paymentId,
                    paymentFields: $scope.currentPaymentFields,
                    amount: $scope.paymentAmount
                };

                paymentsService.payEripPayment(currentPayment)
                    .then(function (result) {
                        openPaymentResultModal({
                            payment: currentPayment,
                            paymentSpecificFieldNames: $scope.currentPayment.fields,
                            paymentName: $scope.currentPayment.name,
                            isSuccessful: true,
                            errorInfo: null
                        }).result.then(function () {}, //cancel callback - do nothing (not used)
                        //dismiss callback
                        function (result) {
                            clearForm();
                            updateAccountsInfo();
                        });
                    }, function (error) {
                        openPaymentResultModal({
                            payment: currentPayment,
                            paymentSpecificFieldNames: $scope.currentPayment.fields,
                            paymentName: $scope.currentPayment.name,
                            isSuccessful: false,
                            errorInfo: error
                        }).result.then(function () {}, //cancel callback - do nothing (not used)
                        //dismiss callback
                        function (result) {
                            updateAccountsInfo();
                        });
                    }).finally(function() {
                        $scope.isBusy = false;
                    });
            };

            activate();
        }]);