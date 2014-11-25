angular.module('services')
    .factory('notificationsInfoService', ['$q', 'notificationsInfoProvider',
        function($q, notificationsInfoProvider) {
            'use strict';

            var self = {};

            self.currentNotificationsInfo = [];

            self.getCurrentUserNotificationsInfo = function() {
                return notificationsInfoProvider.getCurrentUserNotificationsInfo();
            };

            self.getUserNotificationInfoById = function(notificationInfoId) {
                return notificationsInfoProvider.getUserNotificationInfoById(notificationInfoId);
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

            self.markNotificationInfoRead = function(notificationInfoId) {
                return notificationsInfoProvider.markNotificationInfoRead(notificationInfoId);
            };

            return self;
        }]);