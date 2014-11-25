angular.module('ebank-client')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
            'use strict';

            var getCheckAuthForRouteFactory = function(mustBeAnonymous) {
                    mustBeAnonymous = mustBeAnonymous || false;

                    return ['$q', '$rootScope', '$state', '$stateParams', 'userInfoService', 'customEvents',
                        function($q, $rootScope, $state, $stateParams, userInfoService, customEvents) {
                            var deferred = $q.defer();

                            userInfoService.reloadUserInfo()
                                    .finally(function() {
                                        if (userInfoService.isAuthenticated()) {
                                            if (!mustBeAnonymous) {
                                                deferred.resolve(true);
                                            } else {
                                                deferred.reject(false);
                                                $rootScope.$emit(customEvents.general.notAnonymousUser);
                                            }
                                        } else {
                                            if (mustBeAnonymous) {
                                                deferred.resolve(true);
                                            } else {
                                                deferred.reject(false);
                                                $state.go('login');
                                            }
                                        }
                                    });

                            return deferred.promise;
                        }];
                };

            $urlRouterProvider.otherwise('/currency');

            $stateProvider.state('login', {
                url: '/login',
                views: {
                    'site-view': {
                        templateUrl: '/static/main/scripts/app/login/views/login.html',
                        controller: 'loginCtrl'
                    }
                },
                resolve: {
                    auth: getCheckAuthForRouteFactory(true)
                }
            }).state('main', {
                abstract: true,
                views: {
                    'site-view': {
                        templateUrl: '/static/main/scripts/app/main/views/main.html',
                    }
                }
            }).state('main.authenticated', {
                abstract: true,
                views: {
                    'header-view': {
                        templateUrl: '/static/main/scripts/app/header/views/header.html',
                        controller: 'headerCtrl'
                    },
                    'main-view': {
                        templateUrl: '/static/main/scripts/app/main/views/authenticated.html',
                    }
                }
            }).state('main.authenticated.currency', {
                url: '/currency',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/currency/views/currency.html',
                        controller: 'currencyCtrl'
                    }
                },
                resolve: {
                    auth: getCheckAuthForRouteFactory()
                }
            }).state('main.authenticated.accounts', {
                url: '/accounts',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/accounts/views/accounts.html',
                        controller: 'accountsCtrl'
                    }
                },
                resolve: {
                    auth: getCheckAuthForRouteFactory()
                }
            }).state('main.authenticated.accounts.account', {
                url: '/account/:id',
                views: {
                    'account-details-content-view': {
                        templateUrl: '/static/main/scripts/app/accounts/account/views/account.html',
                        controller: 'accounts.accountCtrl'
                    }
                },
                resolve: {
                    auth: getCheckAuthForRouteFactory()
                }
            }).state('main.authenticated.manageAccount', {
                abstract: true,
                url: '/manageaccount',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/manage-account/views/manageAccount.html'
                    }
                }
            }).state('main.authenticated.manageAccount.changePassword', {
                url: '/changepassword',
                views: {
                    'manage-account-content-view': {
                        templateUrl: '/static/main/scripts/app/manage-account/change-password/views/changePassword.html',
                        controller: 'manageAccount.changePasswordCtrl'
                    }
                },
                resolve: {
                    auth: getCheckAuthForRouteFactory()
                }
            }).state('main.authenticated.manageAutomaticAccountOperations', {
                url: '/manageautomaticaccountoperations',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/manage-automatic-account-operations/views/manageAutomaticAccountOperations.html',
                        controller: 'manageAutomaticAccountOperationsCtrl'
                    }
                },
                resolve: {
                    auth: getCheckAuthForRouteFactory()
                }
            }).state('main.authenticated.payments', {
                abstract: true,
                url: '/payments',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/payments/views/payments.html'
                    }
                }
            }).state('main.authenticated.payments.moneyTransfer', {
                url: '/moneytransfer',
                views: {
                    'payments-content-view': {
                        templateUrl: '/static/main/scripts/app/payments/money-transfer/views/moneyTransfer.html',
                        controller: 'payments.moneyTransferCtrl'
                    }
                },
                resolve: {
                    auth: getCheckAuthForRouteFactory()
                }
            }).state('main.authenticated.payments.erip', {
                url: '/erip',
                views: {
                    'payments-content-view': {
                        templateUrl: '/static/main/scripts/app/payments/erip/views/erip.html',
                        controller: 'payments.eripCtrl'
                    }
                },
                resolve: {
                    auth: getCheckAuthForRouteFactory()
                }
            }).state('main.authenticated.notifications', {
                url: '/notifications',
                views: {
                    'main-content-view': {
                        templateUrl: '/static/main/scripts/app/notifications/views/notifications.html',
                        controller: 'notificationsCtrl'
                    }
                },
                resolve: {
                    auth: getCheckAuthForRouteFactory()
                }
            }).state('main.authenticated.notifications.notification', {
                url: '/notification/:id',
                views: {
                    'notification-details-content-view': {
                        templateUrl: '/static/main/scripts/app/notifications/notification/views/notification.html',
                        controller: 'notifications.notificationCtrl'
                    }
                },
                resolve: {
                    auth: getCheckAuthForRouteFactory()
                }
            });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }]);