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
                            deferred.resolve({
                                notification: _.findWhere(data.notifications, {id: notificationInfoId}),
                                timestamp: data.timestamp
                            });
                        }, function(error) {
                            deferred.resolve(data);
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