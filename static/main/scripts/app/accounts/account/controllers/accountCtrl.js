angular.module('ebank-client')
    .controller('accounts.accountCtrl', ['$scope', '$state', '$stateParams', '$modal',
        'userAccountsService',
    function($scope, $state, $stateParams, $modal, userAccountsService) {
        'use strict';

        $scope.isBusy = false;

        function activate() {
            var id = parseInt($stateParams.id);
            var modal;

            if (id === undefined || id < 0) {
                goToAccounsState();
            }

            $scope.isBusy = true;

            userAccountsService.getAccount(id)
                .then(function(accountInfo) {
                    modal = openModal(accountInfo);

                    modal.result.then(
                        //cancel callback - do nothing (not used)
                        function () {},
                        //dismiss callback
                        function (result) {
                            goToAccounsState();
                        });
                }, function(error) {
                    goToAccounsState();
                }).finally(function() {
                    $scope.isBusy = false;
                });
        }

        function openModal(accountInfo) {
            return $modal.open({
              templateUrl: '/static/main/scripts/app/accounts/account/views/accountModal.html',
              controller: 'accounts.account.modalCtrl',
              size: 'lg',
              windowClass: 'account-modal',
              resolve: {
                accountInfo: function() {
                    return accountInfo;
                }
              }
            });
        }

        function goToAccounsState() {
            $state.go('main.authenticated.accounts');
        }

        activate();
    }]).controller('accounts.account.modalCtrl', ['$scope', '$rootScope', 'accountInfo', 'currencyService', 'userAccountsService',
    function($scope, $rootScope, accountInfo, currencyService, userAccountsService) {
        'use strict';

        function activate() {
            $scope.setTab($scope.tabIds.generalInfo);

            currencyService.getCurrencyById(accountInfo.account.currency)
                .then(function(currency) {
                    $scope.currentAccountCurrency = currency;
                });

            //TODO: move this logic somewhere else
            $rootScope.$on('$stateChangeSuccess', function(e, toState) {
                if (toState.name === 'main.authenticated.accounts') {
                    $scope.closeModal();
                }
            });

            $scope.getAccountReport();
        }

        $scope.account = accountInfo.account;

        $scope.tabIds = {
            generalInfo: 0,
            accountStatement: 1
        };

        $scope.stateTimestamp = accountInfo.timestamp;

        $scope.itemsPerPage = 10;
        $scope.currentPageNumber = 1;
        $scope.maxPaginationSize = 5;

        $scope.currentTabId = null;

        $scope.isBusy = false;

        //statement filters
        $scope.statementDateFrom = new Date();
        $scope.statementDateFromFilterEnabled = false;

        $scope.statementDateTo = new Date();
        $scope.statementDateToFilterEnabled = false;

        $scope.statementOperationType = 'erip';
        $scope.statementOperationTypeFilterEnabled = false;

        $scope.minDate = new Date();
        //set a min-date for minus 100 years
        $scope.minDate.setFullYear($scope.minDate.getFullYear() - 25);
        $scope.maxDate = new Date();

        $scope.closeModal = function() {
            $scope.$dismiss();
        };

        $scope.setTab = function(tabId) {
            $scope.currentTabId = tabId;
        };

        $scope.isCurrentTab = function(tabId) {
            return $scope.currentTabId === tabId;
        };

        $scope.getAccountReport = function() {
            userAccountsService.getAccountReport($scope.account.id)
                .then(function(reportInfo) {
                    $scope.reportEntries = reportInfo.reportEntries;
                }, function(error) {
                    console.log(error);
                });
        };

        $scope.getCurrentDate = function() {
            return new Date();
        };

        activate();
    }]);