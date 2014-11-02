angular.module('services')
    .factory('paymentsService', ['$q', '$http', 'endpointGenerationService',
        function($q, $http, endpointGenerationService) {
            'use strict';

            var self = {
                getEripTree: function() {
                    var deferred = $q.defer();

                    $http(endpointGenerationService.getGetEripTreeEndpoint())
                        .then(function(result) {
                            var data = result.data || {};

                            //TODO: move definition to localization
                            data.name = 'Payments';

                            deferred.resolve(data);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            };

            return self;
        }]);