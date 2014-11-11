angular.module('services')
    .factory('userInfoService', ['$q', '$rootScope', 'userInfoProvider', 'customEvents',
        function($q, $rootScope, userInfoProvider, customEvents) {
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
                $rootScope.$on(customEvents.general.logIn, function() {
                    authenticate(true);
                    self.reloadUserInfo();
                });

                $rootScope.$on(customEvents.general.userNotAuthenticated, function() {
                    authenticate(false);
                    setDefaultUserInfo();

                    if (self.isAuthenticated()) {
                        $rootScope.$emit(customEvents.general.sessionExpired);
                    }
                });
            }

            function authenticate(authenticatedFlag) {
                isAuthenticated = authenticatedFlag;
            }

            var self = {};
            self.currentUserInfo = {};

            self.isAuthenticated = function() {
                return isAuthenticated;
            };

            self.reloadUserInfo = function() {
                var promise = userInfoProvider.getUserInfo();

                //TODO: create error callback with logger later
                promise.then(function(userInfo) {
                    self.currentUserInfo = userInfo;
                    authenticate(true);
                });

                return promise;
            };

            self.loginUser = function() {
                var promise = userInfoProvider.loginUser();

                promise.then(function(data) {
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