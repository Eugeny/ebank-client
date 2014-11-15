angular.module('services')
    .factory('currencyService', ['$q', 'currencyProvider',
        function($q, currencyProvider) {
            'use strict';

            var currenciesInfo = null;

            var self = {
                getCurrencyList: function() {
                    var deferred = $q.defer();

                    if (currenciesInfo) {
                        deferred.resolve(currenciesInfo);
                    } else {
                        return self.updateCurrencyList();
                    }

                    return deferred.promise;
                },
                updateCurrencyList: function() {
                    var deferred = $q.defer();

                    currencyProvider.getCurrencyList()
                        .then(function(currencyListData) {
                            currenciesInfo = currencyListData || {};
                            deferred.resolve(currenciesInfo);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },
                getCurrencyById: function(id) {
                    return currencyProvider.getCurrencyById(id);
                }
            };

            return self;
        }]);