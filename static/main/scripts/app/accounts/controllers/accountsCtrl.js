angular.module('ebank-client')
    .controller('accountsCtrl', ['$scope', 'userAccountsService',
        function($scope, userAccountsService) {
            function activate() {
                $scope.reloadAccontsInformation()
            }

            $scope.accounts = [];
            $scope.isBusy = true;
            $scope.stateTimestamp = new Date();

            $scope.reloadAccontsInformation = function() {
                $scope.isBusy = true;

                userAccountsService.getAccounts()
                    .then(function(accounts) {
                        $scope.stateTimestamp = new Date();
                        $scope.accounts = accounts;
                    }, function(error) {
                        console.log(error);
                    }).finally(function() {
                        $scope.isBusy = false;
                    });
            };

            activate();
        }]);