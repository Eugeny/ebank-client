angular.module('providers')
    .factory('paymentsProvider', ['$q', '$http', 'endpointGenerationService',
        function($q, $http, endpointGenerationService) {
            'use strict';

            var self = {
                getEripTree: function() {
                    var deferred = $q.defer();

                    $http(endpointGenerationService.getGetEripTreeEndpoint())
                        .then(function(response) {
                            var eripInfoData = response.data || {};
                            var eripData = eripInfoData.response || {};

                            //TODO: move definition to localization
                            eripData.name = 'Payments';

                            deferred.resolve({
                                eripData: eripData,
                                timestamp: eripInfoData.serverTime
                            });
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },
                payEripPayment: function(paymentData) {
                    var deferred = $q.defer();

                    var paymentPostDataObject = {
                        accountId: paymentData.accountNumber,
                        paymentId: paymentData.paymentId,
                        fields: paymentData.paymentFields,
                        amount: paymentData.amount
                    };

                    $http(endpointGenerationService.getPostEripPayEndpoint(paymentPostDataObject))
                        .then(function(result) {
                            deferred.resolve(result.data || {});
                        }, function(error) {
                            deferred.reject(error.data || {
                                message: 'An error occurred during erip payment process'
                            });
                        });

                    return deferred.promise;
                },
                payGenericPayment: function(paymentData) {
                    var deferred = $q.defer();

                    var paymentPostDataObject = {
                        accountId: paymentData.accountNumber,
                        recipientAccountId: paymentData.recipientAccountNumber,
                        amount: paymentData.amount
                    };

                    $http(endpointGenerationService.getPostPayEndpoint(paymentPostDataObject))
                        .then(function(result) {
                            deferred.resolve(result.data || {});
                        }, function(error) {
                            deferred.reject(error.data || {
                                message: 'An error occurred during payment payment process'
                            });
                        });

                    return deferred.promise;
                }
            };

            return self;
        }]);