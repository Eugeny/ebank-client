angular.module('services')
    .factory('userInfoService', ['$q', '$rootScope', 'userInfoProvider', 'customEvents', 'userNotificationService', 'localizationService', 'gettext',
        function($q, $rootScope, userInfoProvider, customEvents, userNotificationService, localizationService, gettext) {
            'use strict';

            var isAuthenticated = false;

            function setDefaultUserInfo() {
                self.currentUserInfo = {
                    username: '',
                    name: {
                        firstName: '',
                        middleName: '',
                        lastName: ''
                    }
                };
            }

            function activate() {
                setDefaultUserInfo();

                self.reloadUserInfo();

                //subscribe for auth events
                $rootScope.$on(customEvents.general.userNotAuthenticated, function() {
                    if (self.isAuthenticated()) {
                        authenticate(false);
                        setDefaultUserInfo();

                        $rootScope.$emit(customEvents.general.sessionExpired);

                        userNotificationService.showWarning($rootScope.gettext('Your session has expired'));
                    }
                });
            }

            function authenticate(authenticatedFlag) {
                isAuthenticated = authenticatedFlag;
            }

            var self = {};
            self.currentUserInfo = {};

            self.isFirstTimeLoad = true;

            self.isAuthenticated = function() {
                return isAuthenticated;
            };

            self.reloadUserInfo = function() {
                var promise = userInfoProvider.getUserInfo();

                //TODO: create error callback with logger later
                promise.then(function(userInfo) {
                    self.currentUserInfo = userInfo;
                    authenticate(true);
                }).finally(function() {
                    self.isFirstTimeLoad = false;
                });

                return promise;
            };

            self.loginUser = function(login, password) {
                var promise = userInfoProvider.loginUser(login, password);

                promise.then(function(data) {
                    authenticate(true);
                    self.reloadUserInfo();

                    $rootScope.$emit(customEvents.general.logIn);
                });

                return promise;
            };

            self.logoutUser = function() {
                return userInfoProvider.logoutUser()
                    .then(function() {
                        setDefaultUserInfo();
                        authenticate(false);

                        $rootScope.$emit(customEvents.general.logOut);
                    });
            };

            activate();

            return self;
        }]);