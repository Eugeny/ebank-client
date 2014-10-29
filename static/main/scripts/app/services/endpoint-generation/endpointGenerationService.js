angular.module('services')
    .factory('endpointGenerationService', [
        function() {
            return {
                getGetUserInfoEndpoint: function() {
                    return {
                        url: '/api/info',
                        method: 'GET'
                    }
                },
                getPostLogoutUserEndpoint: function() {
                    return {
                        url: '/auth/logout',
                        method: 'POST'
                    }
                },
                getGetEripTreeEndpoint: function() {
                    return {
                        url: '/api/erip/tree',
                        method: 'GET'
                    }
                },
                getPayEndpoint: function(data) {
                    return {
                        url: '/api/pay',
                        method: 'POST',
                        data: data
                    }
                }
            }
        }]);