angular.module('directives')
    .directive('languageSelector', function() {
        return {
        restrict: 'EA',
            templateUrl: 'static/main/scripts/app/directives/language-selector/views/languageSelector.html',
            controller: 'languageSelectorCtrl'
        };
    });