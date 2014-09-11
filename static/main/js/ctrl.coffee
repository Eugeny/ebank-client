window.RootCtrl = ($scope, $cookies, $window, $location) -> 
    $scope.$location = $location
    $scope.$window = $window
    $scope.$cookies = $cookies
    $scope.Math = Math


window.IndexCtrl = ($scope, BankAccount) -> 
	$scope.accounts = BankAccount.query()