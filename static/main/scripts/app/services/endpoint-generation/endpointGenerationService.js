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
                        url: '/api/auth/logout',
                        method: 'POST'
                    };
                },
                //id, password
                getPostLoginUserEndpoint: function(data) {
                    return {
                        url: '/api/auth/login',
                        method: 'POST',
                        data: data
                    };
                },
                //client_id_to_change, old_password, new_password
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
                //accountId, paymentId, fields (object), amount
                getPostEripPayEndpoint: function(data) {
                    return {
                        url: '/api/erip/pay',
                        method: 'POST',
                        data: data
                    };
                },
                //accountId, recipientAccountId, amount
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