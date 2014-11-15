angular.module('filters')
    .filter('slice', function() {
        return function(arr, start, end) {
            if (arr && arr.length) {
                return arr.slice(start, end);
            }

            return [];
        };
    });