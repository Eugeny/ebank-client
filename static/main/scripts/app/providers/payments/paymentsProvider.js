angular.module('providers')
    .factory('paymentsProvider', ['$q', '$http', 'endpointGenerationService',
        function($q, $http, endpointGenerationService) {
            'use strict';

            var self = {
                getEripTree: function() {
                    var deferred = $q.defer();

                    $http(endpointGenerationService.getGetEripTreeEndpoint())
                        .then(function(result) {
                            var data = result.data || {};

                            //TODO: move definition to localization
                            data.name = 'Payments';

                            deferred.resolve(data);
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
                            deferred.reject(error);
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
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            };

            return self;
        }]);