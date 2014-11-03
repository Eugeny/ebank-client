angular.module('services')
    .factory('endpointGenerationService', [
        function() {
            return {
                getGetUserInfoEndpoint: function() {
                    return {
                        url: '/api/info',
                        method: 'GET'
                    };
                },
                getPostLogoutUserEndpoint: function() {
                    return {
                        url: '/auth/logout',
                        method: 'POST'
                    };
                },
                getPostChangeUserPasswordEndpoint: function(data) {
                    return {
                        url: '/api/change-password',
                        method: 'POST',
                        data: data
                    };
                },
                getGetEripTreeEndpoint: function() {
                    return {
                        url: '/api/erip/tree',
                        method: 'GET'
                    };
                },
                getPostEripPayEndpoint: function(data) {
                    return {
                        url: '/api/erip/pay',
                        method: 'POST',
                        data: data
                    };
                },
                getPostPayEndpoint: function(data) {
                    return {
                        url: '/api/pay',
                        method: 'POST',
                        data: data
                    };
                },
                getCurrencyListEndpoint: function() {
                    return {
                        url: '/api/currency',
                        method: 'GET'
                    };
                }
            }
        }]);