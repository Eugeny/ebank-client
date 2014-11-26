angular.module('directives')
    .controller('eripPaymentCtrl', ['$scope', 'paymentsService', 'localizationService', 'customEvents',
        function($scope, paymentsService, localizationService, customEvents) {
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

                $scope.$on(customEvents.eripTree.expandNode, function(event) {
                    event.stopPropagation();
                });
            }

            $scope.isBusy = false;

            $scope.eripTreeRootNode = null;

            $scope.localizationService = localizationService;

            $scope.paymentSelectedCallback = function(item, defaultFields) {
                $scope.currentPaymentFields = {};

                if (defaultFields) {
                    $scope.currentPaymentFields = defaultFields;
                }
            };

            activate();
        }]);