angular.module('directives')
    .directive('generalPayment', [
        function() {
            'use strict';

            return {
                restrict: 'EA',
                scope: {
                    paymentForm: '=',
                    currentPayment: '=',
                    userAccounts: '='
                },
                templateUrl: '/static/main/scripts/app/directives/general-payment/views/generalPayment.html',
                controller: 'generalPaymentCtrl'
            };
        }]).controller('generalPaymentCtrl', ['$scope', 'currencyService',
            function($scope, currencyService) {
                var currencyList = null;

                function activate() {
                    currencyService.getCurrencyList()
                    .then(function(currenciesInfo) {
                        currencyList = currenciesInfo.currencies || [];
                    });
                }

                $scope.getCurrencyById = function(id) {
                    if (currencyList) {
                        return _.findWhere(currencyList, {id: id});
                    } else {
                        return null;
                    }
                };

                activate();
            }]);