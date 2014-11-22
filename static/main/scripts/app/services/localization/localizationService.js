angular.module('services')
    .factory('localizationService', ['$q', '$window', '$cookies', 'gettextCatalog',
        function($q, $window, $cookies, gettextCatalog) {
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
                        code: 'en',
                        friendlyName: 'Eng'
                    },
                    {
                        code: 'ru',
                        friendlyName: 'Рус'
                    },
                    {
                        code: 'be',
                        friendlyName: 'Бел'
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

                self.getSupportedLocales()
                    .then(function(locales) {
                        if (locales.indexOf(locale) != -1) {
                            self.currentLocale = locale;

                            //store locale in local storage
                            setStoredLocaleCode(self.currentLocale.code);

                            //set locale cookie
                            setLocaleCookie(self.currentLocale.code);
                        } else {
                            console.log('The provided locale is not supported');
                            deferred.resolve(false);
                        }
                    }, function(error) {
                        console.log('Can not load the list of supported locales');
                        deferred.reject(error);
                    });

                return deferred.promise;
            };

            activate();

            return self;
        }]);