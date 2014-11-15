angular.module('ebank-client')
    .controller('payments.moneyTransferCtrl', ['$scope', '$modal', 'userAccountsProvider', 'validationRegularExpressions',
            'paymentsService', 'userNotificationService', 'currencyService',
        function($scope, $modal, userAccountsProvider, validationRegularExpressions, paymentsService,
                userNotificationService, currencyService) {
            'use strict';

            var currencyList = null;

            function activate() {
                clearForm();
                updateAccountsInfo();

                currencyService.getCurrencyList()
                    .then(function(currenciesInfo) {
                        currencyList = currenciesInfo.currencies || [];
                    });
            }

            function updateAccountsInfo() {
                $scope.isBusy = true;

                userAccountsProvider.getAccounts()
                    .then(function(accountsInfo) {
                        $scope.userAccounts = accountsInfo.accounts || [];

                        if ($scope.userAccounts.length) {
                            $scope.currentUserAccount = $scope.userAccounts[0];
                        }
                    }, function(error) {
                        console.log(error);
                    }).finally(function() {
                        $scope.isBusy = false;
                        $scope.isFirstTimeLoad = false;
                    });
            }

            function clearForm() {
                $scope.currentPayment = {};

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

            $scope.validationRegularExpressions = validationRegularExpressions;
            $scope.isBusy = false;
            $scope.userAccounts = null;

            $scope.isFirstTimeLoad = true;

            $scope.getCurrencyById = function(id) {
                if (currencyList) {
                    return _.findWhere(currencyList, {id: id});
                } else {
                    return null;
                }
            };

            $scope.pay = function() {
                $scope.isBusy = true;

                var currentPayment = angular.extend($scope.currentPayment, {
                    accountNumber: $scope.currentUserAccount.id,
                    amount: $scope.paymentAmount
                });

                paymentsService.payGenericPayment(currentPayment)
                    .then(function (result) {
                        openPaymentResultModal({
                            payment: currentPayment,
                            paymentName: 'Money Transfer',
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
                            paymentName: 'Money Transfer',
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