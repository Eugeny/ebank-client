(function(window, undefined) {
    'use strict';

    angular.module('ebank-client', [
        'ngAnimate',
        'mgcrea.ngStrap',
        'ui.router',
        'directives'
    ]).run(['$rootScope', 'customEvents',
        function($rootScope, customEvents) {
            $rootScope.$on('$stateChangeSuccess', function() {
                $rootScope.$emit(customEvents.leftMenu.closeLeftMenu);
            });
        }]);
 })(window);