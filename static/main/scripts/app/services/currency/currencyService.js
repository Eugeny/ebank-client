angular.module('services')
    .factory('currencyService', ['$q', 'currencyProvider',
        function($q, currencyProvider) {
            'use strict';

            var currencies = null;

            var self = {
                getCurrencyList: function() {
                    var deferred = $q.defer();

                    if (currencies) {
                        deferred.resolve(currencies);
                    } else {
                        return self.updateCurrencyList();
                    }

                    return deferred.promise;
                },
                updateCurrencyList: function() {
                    var deferred = $q.defer();

                    currencyProvider.getCurrencyList()
                        .then(function(currencyList) {
                            currencies = currencyList;
                            deferred.resolve(currencies);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },
                getCurrencyById: function(id) {
                    var deferred = $q.defer();

                    if (id === undefined) {
                        deferred.reject({
                            message: 'No id set'
                        });
                    } else {
                        self.getCurrencyList()
                            .then(function (currencyList) {
                                var currency = _.findWhere(currencyList, {id: id});

                                    if (currency) {
                                        deferred.resolve(currency);
                                    } else {
                                        deferred.reject({
                                            message: 'Currency not found'
                                        });
                                    }
                            }, function(error) {
                                deferred.reject(error);
                            });
                    }

                    return deferred.promise;
                }
            };

            return self;
        }]);