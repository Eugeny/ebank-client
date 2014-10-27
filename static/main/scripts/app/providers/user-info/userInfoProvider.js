angular.module('providers')
    .factory('userInfoProvider', ['$http', '$q', 'endpointGenerationService',
        function($http, $q, endpointGenerationService) {
            'use strict';

            return {
                getUserInfo: function() {
                    var deferred = $q.defer();

                    $http(endpointGenerationService.getGetUserInfoEndpoint())
                        .then(function(result) {
                            var userInfo = {
                                name: { }
                            };

                            result.data.client = result.data.client || {}

                            userInfo.name.firstName = result.data.client.firstName || '';
                            userInfo.name.middleName = result.data.client.middleName || '';
                            userInfo.name.lastName = result.data.client.lastName || '';
                            userInfo.username = result.data.client.id || '';

                            deferred.resolve(userInfo);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            }
        }])