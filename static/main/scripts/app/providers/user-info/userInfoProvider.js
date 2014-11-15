angular.module('providers')
    .factory('userInfoProvider', ['$http', '$q', 'endpointGenerationService',
        function($http, $q, endpointGenerationService) {
            'use strict';

            return {
                getUserInfo: function() {
                    var deferred = $q.defer();

                    $http(endpointGenerationService.getGetUserInfoEndpoint())
                        .then(function(result) {
                            result.data = result.data || {};
                            var clientData = result.data.client || {}
                            var client = clientData.response || {};

                            var userInfo = {
                                name: { }
                            };

                            userInfo.name.firstName = client.firstName || '';
                            userInfo.name.middleName = client.middleName || '';
                            userInfo.name.lastName = client.lastName || '';
                            userInfo.username = client.id || '';

                            deferred.resolve(userInfo);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },
                loginUser: function(login, password) {
                    return $http(endpointGenerationService.getPostLoginUserEndpoint({
                        id: login,
                        password: password
                    }));
                },
                logoutUser: function() {
                    return $http(endpointGenerationService.getPostLogoutUserEndpoint());
                }
            };
        }]);