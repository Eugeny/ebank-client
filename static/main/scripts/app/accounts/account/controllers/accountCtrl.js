angular.module('ebank-client')
    .controller('accounts.accountCtrl', ['$scope', '$state', '$stateParams', '$modal',
        'userAccountsService', 'userNotificationService',
    function($scope, $state, $stateParams, $modal, userAccountsService, userNotificationService) {
        'use strict';

        $scope.isBusy = false;

        function activate() {
            var id = parseInt($stateParams.id);
            var modal;

            if (id === undefined || id < 0) {
                goToAccounsState();

                userNotificationService.showError('Incorrent notification identifier');
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

                    userNotificationService.showError(error.message);
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
                $scope.closeModal();
            });
        }

        function getStatementOperationDateFromFilterValue() {
            return Math.floor(($scope.statementDateFromFilterEnabled
                ? $scope.statementDateFrom.getTime()
                : 0) / 1000);
        }

        function getStatementOperationDateToFilterValue() {
            return Math.floor(($scope.statementDateToFilterEnabled
                ? $scope.statementDateTo.getTime()
                : new Date().getTime()) / 1000);
        }

        function getStatementOperationTypeFilterValue() {
            return $scope.statementOperationTypeFilterEnabled
                ? $scope.statementOperationType === 'erip'
                : null;
        }

        function getStatementDownloadLink(documentFormat) {
            return '/report/'
                + $scope.account.id + '/'
                + ((getStatementOperationTypeFilterValue() ? 'erip': 'direct') || '') + '/'
                + getStatementOperationDateFromFilterValue() + '/'
                + getStatementOperationDateToFilterValue() + '/'
                + documentFormat;
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

        $scope.isFiltersMenuOpen = false;

        $scope.closeModal = function() {
            $scope.$dismiss();
        };

        $scope.setTab = function(tabId) {
            $scope.currentTabId = tabId;
        };

        $scope.isCurrentTab = function(tabId) {
            return $scope.currentTabId === tabId;
        };

        $scope.loadAccountReport = function() {
            $scope.isBusy = true;

            //accountId, dateFrom(opt), dateTo(opt), isEripPayment(opt)
            userAccountsService.getAccountReport(
                $scope.account.id,
                getStatementOperationDateFromFilterValue(),
                getStatementOperationDateToFilterValue(),
                getStatementOperationTypeFilterValue())
            .then(function(reportInfo) {
                $scope.reportEntries = reportInfo.reportEntries;
                $scope.currentPageNumber = 1;
            }, function(error) {
                console.log(error);
            }).finally(function() {
                $scope.isBusy = false;
            });
        };

        $scope.getFiltersCount = function() {
            return ($scope.statementDateFromFilterEnabled ? 1 : 0)
                + ($scope.statementDateToFilterEnabled ? 1 : 0)
                + ($scope.statementOperationTypeFilterEnabled ? 1 : 0);
        };

        $scope.toggleFiltersMenu = function() {
            $scope.isFiltersMenuOpen = !$scope.isFiltersMenuOpen;
        };

        $scope.getPdfStatementDownloadLink = function() {
            return getStatementDownloadLink('pdf')
        };

        $scope.getCsvStatementDownloadLink = function() {
            return getStatementDownloadLink('csv')
        };

        activate();
    }]);