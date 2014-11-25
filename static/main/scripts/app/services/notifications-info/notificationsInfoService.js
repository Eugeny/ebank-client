angular.module('services')
    .factory('notificationsInfoService', ['$q', 'notificationsInfoProvider',
        function($q, notificationsInfoProvider) {
            'use strict';

            var self = {};

            self.currentNotificationsInfo = [];

            self.getCurrentUserNotificationsInfo = function() {
                return notificationsInfoProvider.getCurrentUserNotificationsInfo();
            };

            self.updateCurrentNotificationsInfo = function() {
                var deferred = $q.defer();

                self.getCurrentUserNotificationsInfo()
                    .then(function(notificationsInfo) {
                        self.currentNotificationsInfo = notificationsInfo.notifications;
                        deferred.resolve(notificationsInfo);
                    }, function(error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            };

            return self;
        }]);