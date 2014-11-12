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
                },
                //accountId, dateFrom(opt), dateTo(opt), isEripPayment(opt)
                getAccountReport: function(accountId, dateFrom, dateTo, isEripPayment) {
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

                    if (isEripPayment !== undefined) {
                        requestObject.type = isEripPayment ? 'erip' : 'direct';
                    }

                    $http(endpointGenerationService.getPostPaymentReportEndpoint(requestObject))
                        .then(function(result) {
                            var reportEntries = result.data;

                            _.each(reportEntries, function(entry) {
                                entry.isEripPayment = entry.type == 'erip';

                                delete entry.type;
                            });

                            deferred.resolve(reportEntries);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            };

            return self;
        }]);