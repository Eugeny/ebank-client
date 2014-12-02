angular.module('directives')
    .controller('languageSelectorCtrl', ['$scope', 'localizationService', 'userNotificationService', 'gettext',
        function($scope, localizationService, userNotificationService, gettext) {
            'use strict';

            function activate() {
                localizationService.getSupportedLocales()
                    .then(function(locales) {
                        $scope.supportedLocales = locales;
                        $scope.currentLocale = localizationService.currentLocale;
                    }, function(error) {
                        userNotificationService.showError(error.message || gettext('Oops, an error occurred, please try again'));
                    });
            }

            $scope.supportedLocales = [];
            $scope.localizationService = localizationService;
            $scope.setCurrentLocale = function(locale) {
                $scope.localizationService.setCurrentLocale(locale);
            };

            activate();
        }]);