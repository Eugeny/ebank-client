angular.module('services')
    .factory('automaticAccountOperationsService', ['automaticAccountOperationsProvider',
        function(automaticAccountOperationsProvider) {
            return {
                getAutomaticAccountOperationsForAccount: function(accountId) {
                    return automaticAccountOperationsProvider.getAutomaticAccountOperationsForAccount(accountId);
                },
                saveAutomaticAccountOperation: function(operationData) {
                    return automaticAccountOperationsProvider.saveAutomaticAccountOperation(operationData);
                },
                removeAutomaticAccountOperation: function(accountId, operationId) {
                    return automaticAccountOperationsProvider.removeAutomaticAccountOperation(accountId, operationId);
                }
            };
        }]);