angular.module('ebank-client')
    .controller('currencyCtrl', ['$scope', 'currencyService', 'localizationService',
        function($scope, currencyService, localizationService) {
            'use strict';

            function activate() {
                $scope.updateCurrencies();
            }

            $scope.currencyService = currencyService;
            $scope.localizationService = localizationService;

            $scope.isFirstTimeLoad = true;

            $scope.isBusy = false;

            $scope.currencyList = [];

            $scope.itemsPerPage = 10;
            $scope.currentPageNumber = 1;
            $scope.maxPaginationSize = 5;

            $scope.updateCurrencies = function() {
                $scope.isBusy = true;

                currencyService.updateCurrencyList()
                    .then(function(currencies) {
                        $scope.stateTimestamp = new Date();
                        $scope.currencyList = currencies;
                    }).finally(function() {
                        $scope.isBusy = false;
                        $scope.isFirstTimeLoad = false;

                        $scope.currentPageNumber = 1;
                    });
            }

            activate();
        }]);