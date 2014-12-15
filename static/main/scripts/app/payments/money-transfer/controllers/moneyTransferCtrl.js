angular.module('ebank-client')
    .controller('payments.moneyTransferCtrl', ['$scope', '$rootScope', '$modal', 'userAccountsProvider', 'validationRegularExpressions',
            'paymentsService', 'userNotificationService', 'confirmationPopup', 'gettext',
        function($scope, $rootScope, $modal, userAccountsProvider, validationRegularExpressions, paymentsService,
                userNotificationService, confirmationPopup, gettext) {
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
                        userNotificationService.showError(error.message
                            || $rootScope.gettext('Oops, an error occurred, please try again'));
                    }).finally(function() {
                        $scope.isBusy = false;
                        $scope.isFirstTimeLoad = false;
                    });
            }

            function clearForm() {
                $scope.currentPayment = {};

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

            $scope.pay = function() {
                confirmationPopup.open(function() {//OK callback
                    $scope.isBusy = true;

                    var currentPayment = {
                        recipientAccountNumber: $scope.currentPayment.recipientAccountNumber,
                        accountNumber: $scope.currentPayment.currentUserAccount.id,
                        amount: $scope.currentPayment.paymentAmount
                    };

                    paymentsService.payGenericPayment(currentPayment)
                        .then(function (result) {
                            openPaymentResultModal({
                                payment: currentPayment,
                                paymentName: {
                                    en: 'Money Transfer',
                                    ru: 'Перевод денег',
                                    be: 'Перавод грошаў'
                                },
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
                                paymentName: {
                                    en: 'Money Transfer',
                                    ru: 'Перевод денег',
                                    be: 'Перавод грошаў'
                                },
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
                }, function() {});
            };

            activate();
        }]);