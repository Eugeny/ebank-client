angular.module('ebank-client')
    .controller('manageAutomaticAccountOperationsCtrl', ['$scope', '$modal', 'automaticAccountOperationsService',
            'userAccountsProvider', 'currencyService', 'userNotificationService', 'gettext', 'paymentsService',
        function($scope, $modal, automaticAccountOperationsService, userAccountsProvider, currencyService,
                userNotificationService, gettext, paymentsService) {
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
                        console.log(error);
                    }).finally(function() {
                        $scope.isBusy = false;  
                        $scope.isFirstTimeLoad = false;
                    });
            }

            function openAutomaticAccountOperationModal(automaticAccountOperationId) {
                return $modal.open({
                    templateUrl: '/static/main/scripts/app/manage-automatic-account-operations/views/automaticAccountOperationModal.html',
                    controller: 'manageAutomaticAccountOperations.automaticAccountOperationCtrl',
                    size: 'lg',
                    windowClass: 'automatic-account-operation-modal',
                    resolve: {
                        automaticAccountOperationId: function() {
                            return automaticAccountOperationId;
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
                return eripPaymentsDictionary[id];
            };

            $scope.reloadAutomaticAccontOperationsInformation = function() {
                if ($scope.currentUserAccount && $scope.currentUserAccount.id) {
                    $scope.isBusy = true;

                    automaticAccountOperationsService.getAutomaticAccountOperationsForAccount($scope.currentUserAccount.id)
                        .then(function(data) {
                            $scope.stateTimestamp = data.timeStamp;
                            $scope.automaticAccountOperations = data.automaticAccountOperations;
                        }, function(error) {
                            userNotificationService.showError(gettext('An error occurred during automatic account operations list loading. Please try again.'));
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

            $scope.removeAutomaticAccountOperation = function(currentAccountId, automaticAccountOperationId) {
                $scope.isBusy = true;

                automaticAccountOperationsService.removeAutomaticAccountOperation(currentAccountId, automaticAccountOperationId)
                    .then(function(data) {
                        updateAccountsInfo();
                        userNotificationService.showSuccess(gettext('Automatic account operation is successfully removed'));
                    }, function(error) {
                        userNotificationService.showError(error.message);
                    }).finally(function() {
                        $scope.isBusy = false;
                    });
            };

            activate();
        }]);