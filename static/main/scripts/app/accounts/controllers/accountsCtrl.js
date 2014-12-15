angular.module('ebank-client')
    .controller('accountsCtrl', ['$scope', '$rootScope', 'userAccountsService', 'currencyService', 'userNotificationService', 'gettext',
        function($scope, $rootScope, userAccountsService, currencyService, userNotificationService, gettext) {
            function activate() {
                $scope.isBusy = true;

                currencyService.getCurrencyList()
                    .then(function(currencies) {
                        $scope.currencies = currencies.currencies;
                    }).finally(function() {
                        $scope.isBusy = false;

                        $scope.reloadAccontsInformation();
                    });

                $rootScope.$on('$stateChangeSuccess', function(e, toState) {
                    if (toState.name === 'main.authenticated.accounts') {
                        $scope.reloadAccontsInformation();
                    }
                });
            }

            $scope.isFirstTimeLoad = true;

            $scope.accounts = [];
            $scope.isBusy = true;
            $scope.stateTimestamp = 0;

            $scope.itemsPerPage = 10;
            $scope.currentPageNumber = 1;
            $scope.maxPaginationSize = 5;

            $scope.reloadAccontsInformation = function() {
                $scope.isBusy = true;

                userAccountsService.getAccounts()
                    .then(function(accountsData) {
                        $scope.stateTimestamp = accountsData.timestamp;
                        $scope.accounts = accountsData.accounts;
                    }, function(error) {
                        userNotificationService.showError(error.message
                            || $rootScope.gettext('Oops, an error occurred, please try again'));
                    }).finally(function() {
                        $scope.isBusy = false;
                        $scope.isFirstTimeLoad = false;

                        $scope.currentPageNumber = 1;
                    });
            };

            $scope.getCurrencyById = function(id) {
                if ($scope.currencies) {
                    return _.findWhere($scope.currencies, {id: id});
                } else {
                    return undefined;
                }
            }

            activate();
        }]);