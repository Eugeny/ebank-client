angular.module('providers')
    .factory('automaticAccountOperationsProvider', ['$q', '$resource', 'endpointGenerationService',
        function($q, $resource, endpointGenerationService) {
            var resource = $resource(
                endpointGenerationService.getResourceAutopaymentEndpoint(),
                {
                    accountId: '',
                    id: ''
                },
                {},
                {
                    stripTrailingSlashes: false
                });

            var self = {
                getAutomaticAccountOperationsForAccount: function(accountId) {
                    var deferred = $q.defer();

                    resource.get(
                        {accountId: accountId},
                        function(data) {
                            deferred.resolve({
                                automaticAccountOperations: data.response,
                                timeStamp: data.serverTime
                            });
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            };

            return self;
        }]);