angular.module('directives')
    .controller('eripTreeNodeCtrl', ['$scope',
        function($scope) {
            'use strict';

            $scope.isExpanded = false;

            //$scope.selectedItem = null;

            $scope.inverseExpansion = function() {
                $scope.isExpanded = !$scope.isExpanded;
            };

            $scope.selectItem = function(item) {
                $scope.selectedItem = item;

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