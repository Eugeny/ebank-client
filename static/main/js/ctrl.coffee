app.controller 'RootCtrl', ($scope, $cookies, $window, $location, $http) -> 
    $scope.$location = $location
    $scope.$window = $window
    $scope.$cookies = $cookies
    $scope.Math = Math

    $http.get('/api/init').success (defs) ->
        $scope.definitions = defs


app.controller 'IndexCtrl', ($scope) -> 
