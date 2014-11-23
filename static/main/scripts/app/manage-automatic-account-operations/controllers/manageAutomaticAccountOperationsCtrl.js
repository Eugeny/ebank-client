angular.module('ebank-client')
    .controller('manageAutomaticAccountOperationsCtrl', ['$scope', 'automaticAccountOperationsService', 'userAccountsProvider', 'currencyService',
            'userNotificationService',
        function($scope, automaticAccountOperationsService, userAccountsProvider, currencyService, userNotificationService) {
            'use strict';

            var currencyList = null;

            function activate() {
                $scope.$watch('currentUserAccount', function() {
                    $scope.reloadAutomaticAccontOperationsInformation();
                })

                $scope.isFirstTimeLoad = false;

                updateAccountsInfo();

                currencyService.getCurrencyList()
                    .then(function(currenciesInfo) {
                        currencyList = currenciesInfo.currencies || [];
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

            $scope.reloadAutomaticAccontOperationsInformation = function() {
                if ($scope.currentUserAccount && $scope.currentUserAccount.id) {
                    $scope.isBusy = true;

                    automaticAccountOperationsService.getAutomaticAccountOperationsForAccount($scope.currentUserAccount.id)
                        .then(function(data) {
                            $scope.stateTimestamp = data.timeStamp;
                            $scope.automaticAccountOperations = data.automaticAccountOperations;
                        }, function(error) {
                            userNofificationService.showError('An error occurred during automatic account operations list loading. Please try again.')
                        }).finally(function() {
                            $scope.isBusy = false;
                        });
                }
            }

            $scope.createAutomaticAccountOperation = function() {

            };

            activate();
        }]);