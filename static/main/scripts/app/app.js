(function(window, undefined) {
    'use strict';

    angular.module('ebank-client', [
        'ngAnimate',
        'ngResource',
        'ngCookies',
        'ui.bootstrap',
        'ui.router',
        'toaster',
        'directives',
        'filters',
        'gettext',
        'templateBundle',
    ]).config(['$interpolateProvider', '$httpProvider',
        function($interpolateProvider, $httpProvider) {
            $httpProvider.interceptors.push('unauthenticatedInterceptor');
    }]).run(['$rootScope', '$http', '$window', '$state', '$stateParams', 'customEvents', 'localizationService',
            'userInfoService', 'gettextCatalog', 'notificationsInfoService', 'validationRegularExpressions',
        function($rootScope, $http, $window, $state, $stateParams, customEvents, localizationService, userInfoService,
                gettextCatalog, notificationsInfoService, validationRegularExpressions) {

            $rootScope.localizationService = localizationService;
            $rootScope.gettext = function (string) {
                return gettextCatalog.getString(string);
            };
            $rootScope.isAppBusy = false;
            $rootScope.validationRegularExpressions = validationRegularExpressions;

            //custom events
            $rootScope.$on(customEvents.general.sessionExpired, function() {
                $state.go('login');
            });

            $rootScope.$on(customEvents.general.logIn, function() {
                $state.go('main.authenticated.currency');
            });

            $rootScope.$on(customEvents.general.notAnonymousUser, function() {
                $state.go('main.authenticated.currency');
            });

            $rootScope.$on(customEvents.general.logOut, function() {
                if (!$state.current.abstract) {
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                }
            });

            //ui router events
            $rootScope.$on('$stateChangeStart', function() {
                $rootScope.isAppBusy = true;
            });

            $rootScope.$on('$stateNotFound', function() {
                $rootScope.isAppBusy = false;
            });

            $rootScope.$on('$stateChangeError', function() {
                $rootScope.isAppBusy = false;
            });

            $rootScope.$on('$stateChangeSuccess', function() {
                $rootScope.$emit(customEvents.leftMenu.closeLeftMenu);

                notificationsInfoService.updateCurrentNotificationsInfo()
                    .finally(function() {
                        $rootScope.isAppBusy = false;
                    });
            });
        }]);
 })(window);