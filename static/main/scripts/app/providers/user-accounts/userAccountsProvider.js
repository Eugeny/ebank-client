angular.module('providers')
    .factory('userAccountsProvider', ['$http', '$q', 'endpointGenerationService',
        function($http, $q, endpointGenerationService) {
            'use strict';

            var self = {
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
                },
                getAccount: function(accountId) {
                    var deferred = $q.defer();

                    self.getAccounts()
                        .then(function(accounts) {
                            var account = _.findWhere(accounts, {
                                id: accountId
                            });

                            if (account) {
                                deferred.resolve(account);
                            } else {
                                deferred.reject({
                                    message: 'No account with that id found'
                                });
                            }
                        }, function() {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            };

            return self;
        }]);