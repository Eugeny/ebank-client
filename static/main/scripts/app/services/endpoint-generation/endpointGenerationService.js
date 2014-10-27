angular.module('services')
    .factory('endpointGenerationService', [
        function() {
            return {
                getGetUserInfoEndpoint: function() {
                    return {
                        url: '/api/get-info',
                        method: 'GET'
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