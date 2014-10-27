(function(window, undefined) {
    'use strict';

    angular.module('directives')
        .directive('customSpinner', function() {
            return {
                restrict: 'E',
                templateUrl: '/static/main/scripts/app/directives/custom-spinner/views/customSpinner.html'
            };
        });
})(window);