app.config ($routeProvider, $locationProvider) ->
    $locationProvider.html5Mode(true)

    $routeProvider.when '/', 
        templateUrl: '/template/main/partial/index.html'
        controller: 'IndexCtrl'

