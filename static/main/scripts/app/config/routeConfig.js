angular.module('ebank-client')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
            'use strict';

            $urlRouterProvider.otherwise('/currency');

            $stateProvider.state('main', {
                abstract: true,
                views: {
                    'header-view': {
                        templateUrl: 'static/main/scripts/app/header/views/header.html',
                        controller: 'headerCtrl'
                    },
                    'main-view': {
                        templateUrl: 'static/main/scripts/app/main/views/main.html',
                    }
                }
            }).state('main.currency', {
                url: '/currency',
                views: {
                    'main-content-view': {
                        templateUrl: 'static/main/scripts/app/currency/views/currency.html',
                        controller: 'currencyCtrl'
                    }
                }
            });

            $locationProvider.html5Mode(true);
        }]);