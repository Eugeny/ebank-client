angular.module('ebank-client')
    .controller('payments.eripCtrl', ['$scope', '$modal', 'userAccountsProvider', 'validationRegularExpressions',
            'paymentsService', 'userNotificationService', 'gettext'
        function($scope, $modal, userAccountsProvider, validationRegularExpressions, paymentsService,
                userNotificationService, gettext) {
            'use strict';

            function activate() {
                clearForm();
                updateAccountsInfo();
            }

            function updateAccountsInfo() {
                $scope.isBusy = true;

                userAccountsProvider.getAccounts()
                    .then(function(accountsInfo) {
                        $scope.userAccounts = accountsInfo.accounts || [];

                        if ($scope.userAccounts.length) {
                            $scope.currentPayment.currentUserAccount = $scope.userAccounts[0];
                        }
                    }, function(error) {
                        userNotificationService.showError(error.message || gettext('Oops, an error occurred, please try again'));
                    }).finally(function() {
                        $scope.isBusy = false;
                        $scope.isFirstTimeLoad = false;
                    });
            }

            function clearForm() {
                $scope.currentPayment = {};
                $scope.currentEripPayment = null;
                $scope.currentPaymentFields = null;

                $scope.currentPayment.currentUserAccount = null;
                $scope.currentPayment.paymentAmount = 1;
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

            $scope.isFirstTimeLoad = true;

            $scope.pay = function() {
                $scope.isBusy = true;
                var currentPayment = {
                    accountNumber: $scope.currentPayment.currentUserAccount.id,
                    paymentId: $scope.currentEripPayment.paymentId,
                    paymentFields: $scope.currentPaymentFields,
                    amount: $scope.currentPayment.paymentAmount
                };

                paymentsService.payEripPayment(currentPayment)
                    .then(function (result) {
                        openPaymentResultModal({
                            payment: currentPayment,
                            paymentSpecificFieldDefinitions: $scope.currentEripPayment.fields,
                            paymentName: $scope.currentEripPayment.name,
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
                            paymentSpecificFieldDefinitions: $scope.currentEripPayment.fields,
                            paymentName: $scope.currentEripPayment.name,
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