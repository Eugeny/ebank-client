(function(window, undefined) {
    'use strict';

    angular.module('directives')
        .directive('matchValidator', function() {
            return {
                require: 'ngModel',
                restrict: 'A',
                scope: {
                    matchValidator: '='
                },
                link: function(scope, elem, attrs, ctrl) {
                    scope.$watch(function() {
                        var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                        return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.matchValidator === modelValue;
                    }, function(currentValue) {
                        ctrl.$setValidity('match', currentValue);
                    });
                }
            };
        });
})(window, undefined);