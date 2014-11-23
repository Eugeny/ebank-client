angular.module('services')
    .factory('automaticAccountOperationsService', ['automaticAccountOperationsProvider',
        function(automaticAccountOperationsProvider) {
            return {
                getAutomaticAccountOperationsForAccount: function(accountId) {
                    return automaticAccountOperationsProvider.getAutomaticAccountOperationsForAccount(accountId);
                }
            };
        }]);