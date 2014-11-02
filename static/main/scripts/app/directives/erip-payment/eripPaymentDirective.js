angular.module('directives')
    .directive('eripPayment', function() {
        'use strict';

        return {
            restrict: 'EA',
            scope: {
                paymentForm: '=',
                currentPayment: '=',
                currentPaymentFields: '='
            },
            controller: 'eripPaymentCtrl',
            templateUrl: '/static/main/scripts/app/directives/erip-payment/views/eripPayment.html'
        };
    });