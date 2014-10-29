angular.module('providers')
    .factory('userAccountsProvider', ['$http', '$q', 'endpointGenerationService',
        function($http, $q, endpointGenerationService) {
            'use strict';

            return {
                getAccounts: function() {
                    var deferred = $q.defer();

                    $http(endpointGenerationService.getGetUserInfoEndpoint())
                        .then(function(result) {
                            result.data = result.data || {};
                            var client = result.data.client || {}
                            client.accounts = client.accounts || [];

                            var userAccountsArray = [];

                            _.each(client.accounts, function(account) {
                                userAccountsArray.push(account);
                            });

                            deferred.resolve(userAccountsArray);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            }
        }]);