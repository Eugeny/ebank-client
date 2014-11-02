angular.module('ebank-client')
    .controller('paymentsCtrl', ['$scope',
        function($scope) {
            'use strict';

            $scope.paymentForm = null;
            $scope.currentPayment = null;
            $scope.currentPaymentFields = null;

            $scope.pay = function() {
                console.log($scope.currentPayment, $scope.currentPaymentFields);
            }
        }]);