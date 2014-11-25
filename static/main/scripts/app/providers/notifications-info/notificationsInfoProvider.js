angular.module('providers')
    .factory('notificationsInfoProvider', ['$q', '$http', 'endpointGenerationService',
        function($q, $http, endpointGenerationService) {
            'use strict';

            var self = {
                getCurrentUserNotificationsInfo: function() {
                    var deferred = $q.defer();

                    $http(endpointGenerationService.getGetNotificationsInfoEndpoint())
                        .then(function(data) {
                            deferred.resolve({
                                notifications: data.data,
                                timestamp: new Date(),
                            });
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },
                getUserNotificationInfoById: function(notificationInfoId) {
                    var deferred = $q.defer();

                    self.getCurrentUserNotificationsInfo()
                        .then(function(data) {
                            var notification = _.findWhere(data.notifications, {id: notificationInfoId});

                            if (notification) {
                                deferred.resolve({
                                    notification: notification,
                                    timestamp: data.timestamp
                                });
                            } else {
                                deferred.reject({
                                    message: 'No notification with that id found'
                                });
                            }
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },
                markNotificationInfoRead: function(notificationInfoId) {
                    var deferred = $q.defer();

                    $http(endpointGenerationService.getPostMarkReadNotificationInfoEndpoint(notificationInfoId))
                        .then(function(data) {
                            deferred.resolve(true);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            };

            return self;
        }]);