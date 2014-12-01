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
                            var clientData = result.data.client || {}
                            var client = clientData.response || {};
                            client.accounts = client.accounts || [];

                            var userAccountsArray = [];

                            _.each(client.accounts, function(account) {
                                userAccountsArray.push(account);
                            });

                            deferred.resolve({
                                accounts: userAccountsArray,
                                timestamp: clientData.serverTime
                            });
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },
                getAccount: function(accountId) {
                    var deferred = $q.defer();

                    self.getAccounts()
                        .then(function(accountsData) {
                            var account = _.findWhere(accountsData.accounts, {
                                id: accountId
                            });

                            if (account) {
                                deferred.resolve({
                                    account: account,
                                    timestamp: accountsData.timestamp
                                });
                            } else {
                                deferred.reject({
                                    message: 'No account with that id found'
                                });
                            }
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },
                //accountId, dateFrom(opt), dateTo(opt), isEripPayment(opt)
                getAccountReport: function(accountId, dateFrom, dateTo, paymentType) {
                    var deferred = $q.defer();

                    var requestObject = {
                        accountId: accountId
                    };

                    if (dateFrom) {
                        requestObject.dateFrom = dateFrom;
                    }

                    if (dateTo) {
                        requestObject.dateTo = dateTo;
                    }

                    if (paymentType != null) {
                        requestObject.type = paymentType;
                    }

                    $http(endpointGenerationService.getPostPaymentReportEndpoint(requestObject))
                        .then(function(result) {
                            var reportInfo = result.data || {};
                            var reportEntries = reportInfo.response || [];

                            deferred.resolve({
                                reportEntries: reportEntries,
                                timestamp: reportInfo.serverTime
                            });
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            };

            return self;
        }]);