angular.module('filters')
    .filter('unixtime', function() {
        return function(unixTimeSpan) {
            return unixTimeSpan * 1000;
        };
    })