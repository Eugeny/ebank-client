angular.module('directives')
    .controller('languageSelectorCtrl', ['$scope', 'localizationService', 'userNotificationService',
        function($scope, localizationService, userNotificationService) {
            'use strict';

            function activate() {
                localizationService.getSupportedLocales()
                    .then(function(locales) {
                        $scope.supportedLocales = locales;
                        $scope.currentLocale = localizationService.currentLocale;
                    }, function(error) {
                        userNotificationService.showError(error.message || 'Oops, an error occurred, please try again');
                    });
            }

            $scope.supportedLocales = [];
            $scope.localizationService = localizationService;
            $scope.setCurrentLocale = function(locale) {
                $scope.localizationService.setCurrentLocale(locale);
            };

            activate();
        }]);