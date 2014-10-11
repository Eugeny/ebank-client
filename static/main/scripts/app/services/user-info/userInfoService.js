angular.module('services')
    .factory('userInfoService', ['$q',
        function($q) {
            'use strict';

            function activate() {
                self.currentUserInfo = {
                    username: 'username',
                    name: {
                        firstName: 'Someone',
                        middleName: 'Someone',
                        lastName: 'Someone'
                    }
                };
            }

            var self = {};
            self.currentUserInfo = {};

            activate();

            return self;
        }]);