angular.module('directives')
    .controller('eripPaymentCtrl', ['$scope', 'paymentsService', 'localizationService',
        function($scope, paymentsService, localizationService) {
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

            $scope.localizationService = localizationService;

            $scope.paymentSelectedCallback = function() {
                $scope.currentPaymentFields = {};
            };

            activate();
        }]);