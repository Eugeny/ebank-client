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
            }).state('main.manageAccount', {
                abstract: true,
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/manage-account/views/manageAccount.html'
                    }
                }
            }).state('main.manageAccount.changePassword', {
                url: '/manageaccount/changepassword',
                views: {
                    'manage-account-content-view': {
                        templateUrl: '/static/main/scripts/app/manage-account/change-password/views/changePassword.html',
                        controller: 'manageAccount.changePasswordCtrl'
                    }
                }
            });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }]);