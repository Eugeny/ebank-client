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
                markNotificationInfoRead: function(notificationInfoId) {
                    var deferred = $q.defer();

                    $http(endpointGenerationService.getPostMarkReadNotificationInfoEndpoint(notificationInfoId))
                        .then(function(data) {
                            deferre.resolve(true);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            };

            return self;
        }]);