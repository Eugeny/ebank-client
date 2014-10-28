angular.module('services')
    .factory('userAccountsService', ['userAccountsProvider',
        function(userAccountsProvider) {
            'use strict';

            return  {
                getAccounts: function() {
                    return userAccountsProvider.getAccounts();
                }
            }
        }]);