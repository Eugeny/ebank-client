angular.module('services')
    .factory('localizationService', ['$q',
        function($q) {
            'use strict';

            function activate() {
                //TODO: load locale from user settings
                self.getSupportedLocales()
                    .then(function(locales) {
                        self.setCurrentLocale(locales[0])
                            .then(function(result) {
                                //congratulations, default locale is set
                            }, function(error) {
                                //TODO: handle error and notify user
                            });
                    }, function(error) {
                        //TODO: handle error and notify user
                    });
            }

            //TODO: replace with retviewing data from the server
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
                ],
                localizationDataDictionary= {
                    'en': {},
                    'ru': {},
                    'be': {}
                },
                defaultLocalizationData = {};

            var self = {};

            self.currentLocalizationData = null;
            self.currentLocale = null;

            self.getLocalizationDataForLocale = function(locale) {
                var deferred = $q.defer();

                if (locale.code && localizationDataDictionary[locale.code]) {
                    deferred.resolve(localizationDataDictionary[locale.code]);
                } else {
                    //TODO: try to load localization data from the back end
                }

                return deferred.promise;
            };

            self.getSupportedLocales = function() {
                var deferred = $q.defer();

                if (supportedLocales && supportedLocales.length) {
                    deferred.resolve(supportedLocales);
                } else {
                    //TODO: call service
                }

                return deferred.promise;
            };

            self.setCurrentLocalizationDataToDefault = function() {
                if (defaultLocalizationData) {
                    self.currentLocalizationData = defaultLocalizationData;
                } else {
                    //TODO: load default localization data from server and set it
                }
            };

            self.setCurrentLocale = function(locale) {
                var deferred = $q.defer();

                self.getSupportedLocales()
                    .then(function(locales) {
                        if (locales.indexOf(locale) != -1) {
                            self.currentLocale = locale;

                            self.getLocalizationDataForLocale(locale)
                                .then(function(localizationData) {
                                    self.currentLocalizationData = localizationData;
                                    self.currentLocale = locale;
                                    deferred.resolve(true);
                                }, function() {
                                    self.setCurrentLocalizationDataToDefault();
                                    deferred.resolve(false);
                                });
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