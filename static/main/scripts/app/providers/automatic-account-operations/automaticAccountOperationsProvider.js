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
                                timestamp: data.serverTime
                            });
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },
                getAutomaticAccountUperationById: function(accountId, operationId) {
                    var deferred = $q.defer();

                    resource.get({
                        accountId: accountId,
                        id: operationId
                    }, function(data) {
                        if (data && data.response) {
                            deferred.resolve({
                                automaticAccountOperation: data.response,
                                timestamp: data.serverTime
                            });
                        } else {
                            deferred.reject({
                                message: 'No operations with that id found'
                            });
                        }
                    }, function(error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                /*{
                    startDate,
                    period,
                    type,
                    data: {
                        accountNumber,
                        amount,

                        //erip fields
                        paymentId,
                        paymentFields,

                        //money transfer fields
                        recipientAccountNumber
                    },

                    //update fields
                    id
                }*/
                saveAutomaticAccountOperation: function(operationData) {
                    var deferred = $q.defer();

                    var data = {
                        startDate: operationData.startDate,
                        period: operationData.period,
                        type: operationData.type,
                        data: {
                            amount: operationData.data.amount
                        }
                    };

                    if (operationData.type == 'erip') {
                        data.data.paymentId = operationData.data.paymentId;
                        data.data.paymentFields = operationData.data.paymentFields;
                    } else {
                        data.data.recipientAccountId = operationData.data.recipientAccountNumber;
                    }

                    var saveOptions = {
                        accountId: operationData.data.accountNumber
                    };

                    if (operationData.id) {
                        saveOptions.id = operationData.id;
                    }

                    resource.save(
                        saveOptions,
                        data,
                        function(data) {
                            deferred.resolve(data);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },
                removeAutomaticAccountOperation: function(accountId, operationId) {
                    var deferred = $q.defer();

                    resource.remove({
                        accountId: accountId,
                        id: operationId
                    },
                    {},
                    function(data) {
                        deferred.resolve(data);
                    }, function(error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                }
            };

            return self;
        }]);