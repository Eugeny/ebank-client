angular.module('ebank-client')
    .controller('accounts.accountCtrl', ['$scope', '$state', '$stateParams', '$modal',
        'userAccountsProvider',
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
                .then(function(account) {
                    modal = openModal(account);

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

        function openModal(account) {
            return $modal.open({
              templateUrl: '/static/main/scripts/app/accounts/account/views/accountModal.html',
              controller: 'accounts.account.modalCtrl',
              size: 'lg',
              windowClass: 'account-modal',
              resolve: {
                account: function() {
                    return account;
                }
              }
            });
        }

        function goToAccounsState() {
            $state.go('main.accounts');
        }

        activate();
    }]).controller('accounts.account.modalCtrl', ['$scope', '$rootScope', 'account', 'currencyService',
        'localizationService',
    function($scope, $rootScope, account, currencyService, localizationService) {
        'use strict';

        function activate() {
            $scope.setTab($scope.tabIds.generalInfo);

            currencyService.getCurrencyById(account.currency)
                .then(function(currency) {
                    $scope.currentAccountCurrency = currency;
                });

            //TODO: move this logic somewhere else
            $rootScope.$on('$stateChangeSuccess', function(e, toState) {
                if (toState.name === 'main.accounts') {
                    $scope.closeModal();
                }
            });
        }

        $scope.localizationService = localizationService;

        $scope.account = account;

        $scope.tabIds = {
            generalInfo: 0,
            accountStatement: 1
        };

        $scope.stateTimestamp = new Date();

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

        activate();
    }]);