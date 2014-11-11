(function(window, undefined) {
    'use strict';

    angular.module('ebank-client', [
        'ngAnimate',
        'mgcrea.ngStrap',
        'ui.bootstrap',
        'ui.router',
        'toaster',
        'directives',
        'filters',
    ]).config(['$interpolateProvider', '$httpProvider',
        function($interpolateProvider, $httpProvider) {
            $httpProvider.interceptors.push('unauthenticatedInterceptor');
    }]).run(['$rootScope', '$http', '$window', '$state', '$stateParams', 'customEvents', 'localizationService',
        function($rootScope, $http, $window, $state, $stateParams, customEvents, localizationService) {
            $rootScope.localizationService = localizationService;

            $rootScope.$on('$stateChangeSuccess', function() {
                $rootScope.$emit(customEvents.leftMenu.closeLeftMenu);
            });

            $rootScope.$on(customEvents.general.logOut, function() {
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: true,
                    notify: true
                });
            });
        }]);
 })(window);