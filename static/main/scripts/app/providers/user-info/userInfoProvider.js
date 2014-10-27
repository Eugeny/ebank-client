angular.module('providers')
    .factory('userInfoProvider', ['$http', 'endpointGenerationService',
        function($http, endpointGenerationService) {
            'use strict';

            return {
                getUserInfo: function() {
                    return $http(endpointGenerationService.getGetUserInfoEndpoint());
                }
            }
        }])