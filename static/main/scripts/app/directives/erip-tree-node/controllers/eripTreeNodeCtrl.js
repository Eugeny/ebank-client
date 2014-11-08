angular.module('directives')
    .controller('eripTreeNodeCtrl', ['$scope',
        function($scope) {
            'use strict';

            $scope.isExpanded = false;

            $scope.inverseExpansion = function() {
                $scope.isExpanded = !$scope.isExpanded;
            };

            $scope.selectItem = function(item) {
                if ($scope.selectedItem != item) {
                    $scope.selectedItem = item;
                } else {
                    $scope.selectedItem = null;
                }

                if ($scope.itemSelectedCallback) {
                    var callback = $scope.itemSelectedCallback();

                    callback && callback(item);
                }
            };

            $scope.isSelectedItem = function(item) {
                return $scope.selectedItem === item;
            };

            $scope.clearSelection = function() {
                $scope.selectedItem = null;
            };
        }]);