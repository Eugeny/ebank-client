angular.module('directives')
    .directive('eripTreeNode', ['recursiveDirectiveHelperService',
        function(recursiveDirectiveHelperService) {
            'use strict';

            return {
                restrict: 'EA',
                controller: 'eripTreeNodeCtrl',
                templateUrl: '/static/main/scripts/app/directives/erip-tree-node/views/eripTreeNode.html',
                scope: {
                    selectedItem:'=',
                    node: '=',
                    itemSelectedCallback: '&'
                },
                compile: function(element) {
                    return recursiveDirectiveHelperService.compile(element);
                }
            };
        }]);