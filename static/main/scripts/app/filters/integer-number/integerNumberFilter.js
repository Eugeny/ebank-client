angular.module('filters')
    .filter('integerNumber', function() {
        return function(number) {
            return Math.floor(number);
        };
    })