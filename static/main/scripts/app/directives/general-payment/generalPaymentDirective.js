angular.module('directives')
    .directive('generalPayment', [
        function() {
            'use strict';

            return {
                restrict: 'EA',
                scope: {
                    paymentForm: '=',
                    currentPayment: '=',
                    userAccounts: '='
                },
                templateUrl: '/static/main/scripts/app/directives/general-payment/views/generalPayment.html'
            };
        }]);