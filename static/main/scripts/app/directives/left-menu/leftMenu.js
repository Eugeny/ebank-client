angular.module('directives')
    .directive('leftMenu', function() {
        'use strict';

        return {
            restrict: 'E',
            controller: 'leftMenuCtrl',
            templateUrl: '/static/main/scripts/app/directives/left-menu/views/leftMenu.html',
            scope: {
                isOpen: '='
            },
            transclude: true
        };
    });