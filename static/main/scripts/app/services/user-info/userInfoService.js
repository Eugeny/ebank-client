angular.module('services')
    .factory('userInfoService', ['userInfoProvider',
        function(userInfoProvider) {
            'use strict';

            function loadUserInfoFromResponseData(data) {
                data.client = data.client || {};

                self.currentUserInfo.name.firstName = data.client.firstName || '';
                self.currentUserInfo.name.middleName = data.client.middleName || '';
                self.currentUserInfo.name.lastName = data.client.lastName || '';
                self.currentUserInfo.username = data.client.id || '';
            };

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
                promise.then(function(result) {
                    result.data = result.data || {};
                    loadUserInfoFromResponseData(result.data);
                });

                return promise;
            };

            activate();

            return self;
        }]);