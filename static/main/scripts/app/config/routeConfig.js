angular.module('ebank-client')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
            'use strict';

            $urlRouterProvider.otherwise('/currency');

            $stateProvider.state('main', {
                abstract: true,
                views: {
                    'header-view': {
                        templateUrl: '/static/main/scripts/app/header/views/header.html',
                        controller: 'headerCtrl'
                    },
                    'main-view': {
                        templateUrl: '/static/main/scripts/app/main/views/main.html',
                    }
                }
            }).state('main.currency', {
                url: '/currency',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/currency/views/currency.html',
                        controller: 'currencyCtrl'
                    }
                }
            }).state('main.accounts', {
                url: '/accounts',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/accounts/views/accounts.html',
                        controller: 'accountsCtrl'
                    }
                }
            }).state('main.accounts.account', {
                url: '/account/:id',
                views: {
                    'account-details-content-view': {
                        templateUrl: '/static/main/scripts/app/accounts/account/views/account.html',
                        controller: 'accounts.accountCtrl'
                    }
                }
            }).state('main.manageAccount', {
                abstract: true,
                url: '/manageaccount',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/manage-account/views/manageAccount.html'
                    }
                }
            }).state('main.manageAccount.changePassword', {
                url: '/changepassword',
                views: {
                    'manage-account-content-view': {
                        templateUrl: '/static/main/scripts/app/manage-account/change-password/views/changePassword.html',
                        controller: 'manageAccount.changePasswordCtrl'
                    }
                }
            }).state('main.manageAutomaticAccountOperations', {
                url: '/manageautomaticaccountoperations',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/manage-automatic-account-operations/views/manageAutomaticAccountOperations.html',
                        controller: 'manageAutomaticAccountOperationsCtrl'
                    }
                }
            }).state('main.payments', {
                abstract: true,
                url: '/payments',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/payments/views/payments.html'
                    }
                }
            }).state('main.payments.moneyTransfer', {
                url: '/moneytransfer',
                views: {
                    'payments-content-view': {
                        templateUrl: '/static/main/scripts/app/payments/money-transfer/views/moneyTransfer.html',
                        controller: 'payments.moneyTransferCtrl'
                    }
                }
            }).state('main.payments.erip', {
                url: '/erip',
                views: {
                    'payments-content-view': {
                        templateUrl: '/static/main/scripts/app/payments/erip/views/erip.html',
                        controller: 'payments.eripCtrl'
                    }
                }
            });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }]);