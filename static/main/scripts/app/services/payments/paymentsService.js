angular.module('services')
    .factory('paymentsService', ['paymentsProvider',
        function(paymentsProvider) {
            'use strict';

            var self = {
                getEripTree: function() {
                    return paymentsProvider.getEripTree();
                },
                payEripPayment: function(paymentData) {
                    return paymentsProvider.payEripPayment(paymentData);
                },
                payGenericPayment: function(paymentData) {
                    return paymentsProvider.payGenericPayment(paymentData);
                },
                //accountId, dateFrom(opt), dateTo(opt), isEripPayment(opt)
                getAccountReport: function(accountId, dateFrom, dateTo, isEripPayment) {
                    return paymentsProvider.getAccountReport(accountId, dateFrom, dateTo, isEripPayment);
                }
            };

            return self;
        }]);