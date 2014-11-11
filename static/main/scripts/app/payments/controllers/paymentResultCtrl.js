angular.module('ebank-client')
    .controller('payments.paymentResultCtrl', ['$scope', 'paymentResult',
        function($scope, paymentResult) {
            'use strict';

            /*{
                payment: '=',
                errorInfo: '=',
                isSuccessful: '=',
                paymentName: '='
            }*/

            $scope.paymentResult = paymentResult;

            $scope.closeModal = function() {
                $scope.$dismiss();
            };
        }]);