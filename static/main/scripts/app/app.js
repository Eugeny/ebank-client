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
    ]).run(['$rootScope', '$http', '$window', 'customEvents', 'endpointGenerationService', 'localizationService',
        function($rootScope, $http, $window, customEvents, endpointGenerationService, localizationService) {
            $rootScope.localizationService = localizationService;

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