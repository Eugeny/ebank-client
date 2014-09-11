window.RootCtrl = ($scope, $rootScope, $timeout, $cookies, $window, $templateCache, $http, $location) -> 
    $scope.$location = $location
    $scope.$timeout = $timeout
    $scope.$window = $window
    $scope.$cookies = $cookies
    $scope.Math = Math


window.IndexCtrl = ($scope, $timeout, $interval, $location, $window) -> 
