angular.module('directives')
    .controller('eripTreeNodeCtrl', ['$scope', 'customEvents',
        function($scope, customEvents) {
            'use strict';

            function activate() {
                $scope.$on(customEvents.eripTree.paymentSelected, function (event, paymentId, paymentFields) {
                    

                    if ($scope.node && $scope.node.payments) {
                        var payment = _.findWhere($scope.node.payments, {paymentId: paymentId});

                        if (payment) {
                            $scope.selectItem(payment, paymentFields);

                            $scope.$emit(customEvents.eripTree.expandNode);
                        }
                    }
                });

                $scope.$on(customEvents.eripTree.expandNode, function() {
                    $scope.isExpanded = true;
                });
            }

            $scope.isExpanded = false;

            $scope.inverseExpansion = function() {
                $scope.isExpanded = !$scope.isExpanded;
            };

            $scope.selectItem = function(item, defaultFields) {
                if ($scope.selectedItem != item) {
                    $scope.selectedItem = item;
                } else {
                    $scope.selectedItem = null;
                }

                if ($scope.itemSelectedCallback) {
                    var callback = $scope.itemSelectedCallback();

                    callback && callback(item, defaultFields);
                }
            };

            $scope.isSelectedItem = function(item) {
                return $scope.selectedItem === item;
            };

            $scope.clearSelection = function() {
                $scope.selectedItem = null;
            };

            activate();
        }]);