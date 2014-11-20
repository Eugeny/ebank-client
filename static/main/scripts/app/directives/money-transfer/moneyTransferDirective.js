angular.module('directives')
    .directive('moneyTransfer', [function(){
        'use strict';

        return {
            restrict: 'EA',
            scope: {
                paymentForm: '=',
                currentPayment: '='
            },
            templateUrl: '/static/main/scripts/app/directives/money-transfer/views/moneyTransfer.html'
        };
    }]);