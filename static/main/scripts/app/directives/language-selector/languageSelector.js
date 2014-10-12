angular.module('directives')
    .directive('languageSelector', function() {
        'use strict';

        return {
            restrict: 'EA',
            templateUrl: 'static/main/scripts/app/directives/language-selector/views/languageSelector.html',
            controller: 'languageSelectorCtrl'
        };
    });