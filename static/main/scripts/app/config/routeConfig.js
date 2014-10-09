angular.module('ebank-client')
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider.state('main', {
				abstract: true
			});

			$locationProvider.html5Mode(true);
		}]);