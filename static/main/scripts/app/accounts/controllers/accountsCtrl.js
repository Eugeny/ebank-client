angular.module('ebank-client')
    .controller('accountsCtrl', ['$scope', 'userAccountsService', 'currencyService',
        function($scope, userAccountsService, currencyService) {
            function activate() {
                $scope.isBusy = true;

                currencyService.getCurrencyList()
                    .then(function(currencies) {
                        $scope.currencies = currencies.currencies;
                    }).finally(function() {
                        $scope.isBusy = false;

                        $scope.reloadAccontsInformation();
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
                        console.log(error);
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