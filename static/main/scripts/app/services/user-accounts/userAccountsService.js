angular.module('services')
    .factory('userAccountsService', ['userAccountsProvider',
        function(userAccountsProvider) {
            'use strict';

            return  {
                getAccounts: function() {
                    return userAccountsProvider.getAccounts();
                },
                getAccount: function(accountId) {
                    return userAccountsProvider.getAccount(accountId);
                },
                //accountId, dateFrom(opt), dateTo(opt), isEripPayment(opt)
                getAccountReport: function(accountId, dateFrom, dateTo, paymentType) {
                    return userAccountsProvider.getAccountReport(accountId, dateFrom, dateTo, paymentType);
                }
            }
        }]);