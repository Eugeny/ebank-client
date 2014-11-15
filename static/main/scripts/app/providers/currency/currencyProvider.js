angular.module('providers')
    .factory('currencyProvider', ['$q', '$http', 'endpointGenerationService',
        function($q, $http, endpointGenerationService) {
            'use strict';

            var self = {
                getCurrencyList: function() {
                    var deferred = $q.defer();

                    $http(endpointGenerationService.getCurrencyListEndpoint())
                        .then(function(response) {
                            var data = response.data || {};
                            deferred.resolve({
                                currencies: data.response,
                                timestamp: data.serverTime
                            });
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
                            .then(function(response) {
                                var currencies = response.currencies || [];

                                var currency = _.findWhere(currencies, {id: id});

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