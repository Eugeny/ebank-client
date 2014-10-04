app.config ($routeProvider, $locationProvider) ->
    $locationProvider.html5Mode enabled: true, requireBase: false

    $routeProvider.when '/', 
        templateUrl: '/template/index.html'
        controller: 'IndexCtrl'

