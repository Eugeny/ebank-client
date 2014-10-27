angular.module('services')
    .factory('userInfoService', ['userInfoProvider',
        function(userInfoProvider) {
            'use strict';

            function activate() {
                self.currentUserInfo = {
                    username: '',
                    name: {
                        firstName: '',
                        middleName: '',
                        lastName: ''
                    }
                };

                self.reloadUserInfo();
            }

            var self = {};
            self.currentUserInfo = {};

            self.reloadUserInfo = function() {
                var promise = userInfoProvider.getUserInfo();

                //TODO: create error callback with logger later
                promise.then(function(userInfo) {
                    self.currentUserInfo = userInfo;
                });

                return promise;
            };

            activate();

            return self;
        }]);