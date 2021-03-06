angular.module('ebank-client')
    .controller('manageAutomaticAccountOperationsCtrl', ['$scope', '$rootScope', '$modal', 'automaticAccountOperationsService',
            'userAccountsProvider', 'currencyService', 'userNotificationService', 'gettext', 'paymentsService',
            'confirmationPopup',
        function($scope, $rootScope, $modal, automaticAccountOperationsService, userAccountsProvider, currencyService,
                userNotificationService, gettext, paymentsService, confirmationPopup) {
            'use strict';

            var currencyList = null;

            var eripPaymentsDictionary = null;

            function activate() {
                $scope.$watch('currentUserAccount', function() {
                    $scope.reloadAutomaticAccontOperationsInformation();
                });

                $scope.isFirstTimeLoad = false;

                updateAccountsInfo();

                currencyService.getCurrencyList()
                    .then(function(currenciesInfo) {
                        currencyList = currenciesInfo.currencies || [];
                    });

                paymentsService.getEripPayments()
                    .then(function(eripPayments) {
                        eripPaymentsDictionary = eripPayments.response;
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
                        userNotificationService.showError(error.message
                            || $rootScope.gettext('Oops, an error occurred, please try again'));
                    }).finally(function() {
                        $scope.isBusy = false;
                        $scope.isFirstTimeLoad = false;
                    });
            }

            function openAutomaticAccountOperationModal(automaticAccountOperation, editingAutomaticAccountOperationAccountId) {
                return $modal.open({
                    templateUrl: '/static/main/scripts/app/manage-automatic-account-operations/views/automaticAccountOperationModal.html',
                    controller: 'manageAutomaticAccountOperations.automaticAccountOperationCtrl',
                    size: 'lg',
                    windowClass: 'automatic-account-operation-modal',
                    resolve: {
                        automaticAccountOperation: function() {
                            return automaticAccountOperation;
                        },
                        editingAutomaticAccountOperationAccountId: function() {
                            return editingAutomaticAccountOperationAccountId;
                        }
                    }
                });
            }

            $scope.isFirstTimeLoad = true;

            $scope.userAccounts = [];

            $scope.currentUserAccount = null;

            $scope.isBusy = false;
            $scope.stateTimestamp = 0;

            $scope.itemsPerPage = 10;
            $scope.currentPageNumber = 1;
            $scope.maxPaginationSize = 5;

            $scope.automaticAccountOperations = [];

            $scope.getCurrencyById = function(id) {
                if (currencyList) {
                    return _.findWhere(currencyList, {id: id});
                } else {
                    return null;
                }
            };

            $scope.getEripPaymentById = function(id) {
                if (eripPaymentsDictionary && id) {
                    return eripPaymentsDictionary[id];
                }
            };

            $scope.reloadAutomaticAccontOperationsInformation = function() {
                if ($scope.currentUserAccount && $scope.currentUserAccount.id) {
                    $scope.isBusy = true;

                    automaticAccountOperationsService.getAutomaticAccountOperationsForAccount($scope.currentUserAccount.id)
                        .then(function(data) {
                            $scope.stateTimestamp = data.timestamp;
                            $scope.automaticAccountOperations = data.automaticAccountOperations;
                        }, function(error) {
                            userNotificationService.showError(
                                $rootScope.gettext('An error occurred during automatic account operations list loading. Please try again.'));
                        }).finally(function() {
                            $scope.isBusy = false;
                        });
                }
            };

            $scope.createAutomaticAccountOperation = function() {
                openAutomaticAccountOperationModal()
                    .result.then(function () {}, //cancel callback - do nothing (not used)
                    //dismiss callback
                    function (result) {
                        updateAccountsInfo();
                    });
            };

            $scope.editAutomaticAccountOperation = function(automaticAccountOperation) {
                openAutomaticAccountOperationModal(automaticAccountOperation, $scope.currentUserAccount.id)
                    .result.then(function () {}, //cancel callback - do nothing (not used)
                    //dismiss callback
                    function (result) {
                        updateAccountsInfo();
                    });
            };

            $scope.removeAutomaticAccountOperation = function(currentAccountId, automaticAccountOperationId) {
                confirmationPopup.open(function() {//OK callback
                    $scope.isBusy = true;

                    automaticAccountOperationsService.removeAutomaticAccountOperation(currentAccountId, automaticAccountOperationId)
                        .then(function(data) {
                            updateAccountsInfo();
                            userNotificationService.showSuccess(
                                $rootScope.gettext('Automatic account operation is successfully removed'));
                        }, function(error) {
                            userNotificationService.showError(error.message
                                || $rootScope.gettext('Oops, an error occurred, please try again'));
                        }).finally(function() {
                            $scope.isBusy = false;
                        });
                }, function() {});
            };

            activate();
        }]);