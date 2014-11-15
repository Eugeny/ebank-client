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

        $scope.currentTabId = null;

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
                    console.log(reportInfo.reportEntries);
                }, function(error) {
                    console.log(error);
                });
        };

        activate();
    }]);