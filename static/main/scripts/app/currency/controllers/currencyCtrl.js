angular.module('ebank-client')
    .controller('currencyCtrl', ['$scope', 'currencyService',
        function($scope, currencyService) {
            'use strict';

            function activate() {
                currencyService.getCurrencyList()
                    .then(function(currencies) {
                        $scope.currencies = currencies;
                        console.log(currencies);
                    }, function(error) {
                        console.log(error);
                    });
            }

            activate();
        }]);