angular.module('ebank-client')
    .controller('accountsCtrl', ['$scope', 'userAccountsService', 'currencyService',
        function($scope, userAccountsService, currencyService) {
            function activate() {
                $scope.reloadAccontsInformation();

                $scope.isBusy = true;
                currencyService.getCurrencyList()
                    .then(function(currencies) {
                        $scope.currencies = currencies;
                    }).finally(function() {
                        $scope.isBusy = false;
                    });
            }

            $scope.isFirstTimeLoad = true;

            $scope.accounts = [];
            $scope.isBusy = true;
            $scope.stateTimestamp = new Date();

            $scope.itemsPerPage = 10;
            $scope.currentPageNumber = 1;
            $scope.maxPaginationSize = 5;

            $scope.reloadAccontsInformation = function() {
                $scope.isBusy = true;

                userAccountsService.getAccounts()
                    .then(function(accounts) {
                        $scope.stateTimestamp = new Date();
                        $scope.accounts = accounts;
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