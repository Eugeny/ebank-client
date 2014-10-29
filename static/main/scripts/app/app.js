(function(window, undefined) {
    'use strict';

    angular.module('ebank-client', [
        'ngAnimate',
        'mgcrea.ngStrap',
        'ui.router',
        'directives'
    ]).run(['$rootScope', '$http', '$window', 'customEvents', 'endpointGenerationService',
        function($rootScope, $http, $window, customEvents, endpointGenerationService) {
            $rootScope.$on('$stateChangeSuccess', function() {
                $rootScope.$emit(customEvents.leftMenu.closeLeftMenu);
            });

            $rootScope.$on(customEvents.general.logOut, function() {
                $http(endpointGenerationService.getPostLogoutUserEndpoint())
                    .then(function() {
                        $window.location.reload();
                    });
            });
        }]);
 })(window);