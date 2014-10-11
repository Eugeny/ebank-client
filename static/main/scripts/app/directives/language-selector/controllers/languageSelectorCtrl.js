angular.module('directives')
    .controller('languageSelectorCtrl', ['$scope', 'localizationService',
        function($scope, localizationService) {
            'use strict';

            function activate() {
                localizationService.getSupportedLocales()
                    .then(function(locales) {
                        $scope.supportedLocales = locales;
                        $scope.currentLocale = localizationService.currentLocale;
                    }, function(error) {
                        //TODO: call notification service to notify user about problem
                        console.log(error);
                    });
            }

            $scope.supportedLocales = [];
            $scope.localizationService = localizationService;
            $scope.setCurrentLocale = function(locale) {
                $scope.localizationService.setCurrentLocale(locale);
            };

            activate();
        }]);