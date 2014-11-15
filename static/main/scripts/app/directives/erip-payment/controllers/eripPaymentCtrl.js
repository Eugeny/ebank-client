angular.module('directives')
    .controller('eripPaymentCtrl', ['$scope', 'paymentsService',
        function($scope, paymentsService) {
            'use strict';

            function activate() {
                $scope.isReadyToPay = false;
                $scope.isBusy = true;

                paymentsService.getEripTree()
                    .then(function(eripTreeData) {
                        $scope.eripTreeRootNode = eripTreeData.eripData || {};
                    }).finally(function() {
                        $scope.isBusy = false;
                    });
            }

            $scope.isBusy = false;

            $scope.eripTreeRootNode = null;

            $scope.paymentSelectedCallback = function() {
                $scope.currentPaymentFields = {};
            };

            activate();
        }]);