angular.module('services')
    .config(['tmhDynamicLocaleProvider', 
        function (tmhDynamicLocaleProvider) {
            tmhDynamicLocaleProvider.localeLocationPattern('/static/main/vendor/bower_components/angular-i18n/angular-locale_{{locale}}.js');
        }])
    .factory('localizationService', ['$q', '$window', '$cookies', 'gettextCatalog', 'tmhDynamicLocale',
            'userNotificationService', 'gettext',
        function($q, $window, $cookies, gettextCatalog, tmhDynamicLocale, userNotificationService, gettext) {
            'use strict';

            function activate() {
                self.getSupportedLocales()
                    .then(function(locales) {
                        var loadedLocaleCode = getStoredLocaleCode() || locales[0].code;

                        var loadedLocale = _.findWhere(locales, {code: loadedLocaleCode}) || locales[0];

                        self.setCurrentLocale(loadedLocale)
                            .then(function(result) {}, //congratulations, default locale is set
                                function(error) {
                                    //TODO: handle error and notify user
                                });
                    }, function(error) {
                        //TODO: handle error and notify user
                    });
            }

            function getStoredLocaleCode() {
                return $window.localStorage.getItem('saved_locale_code');
            }

            function setStoredLocaleCode(localeCode) {
                $window.localStorage.setItem('saved_locale_code', localeCode);
            }

            function setLocaleCookie(localeCode) {
                $cookies.django_language = localeCode;
            }

            var supportedLocales = [
                    {
                        code: 'ru',
                        friendlyName: 'Рус'
                    },
                    {
                        code: 'be',
                        friendlyName: 'Бел'
                    },
                    {
                        code: 'en',
                        friendlyName: 'Eng'
                    }
                ];

            var self = {};

            self.currentLocale = null;

            self.getSupportedLocales = function() {
                var deferred = $q.defer();

                if (supportedLocales && supportedLocales.length) {
                    deferred.resolve(supportedLocales);
                } else {
                    //TODO: call service
                }

                return deferred.promise;
            };

            self.setCurrentLocale = function(locale) {
                var deferred = $q.defer();

                gettextCatalog.setCurrentLanguage(locale.code);
                tmhDynamicLocale.set(locale.code);

                self.getSupportedLocales()
                    .then(function(locales) {
                        if (locales.indexOf(locale) != -1) {
                            self.currentLocale = locale;

                            //store locale in local storage
                            setStoredLocaleCode(self.currentLocale.code);

                            //set locale cookie
                            setLocaleCookie(self.currentLocale.code);
                        } else {
                            userNotificationService.showWarning(gettext('The provided locale is not supported'));
                            deferred.resolve(false);
                        }
                    }, function(error) {
                        userNotificationService.showWarning(gettext('Can not load the list of supported locales'));
                        deferred.reject(error);
                    });

                return deferred.promise;
            };

            activate();

            return self;
        }]);