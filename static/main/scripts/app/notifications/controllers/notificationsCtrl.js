angular.module('ebank-client')
    .controller('notificationsCtrl', ['$scope', '$rootScope', 'notificationsInfoService', 'currencyService',
            'userNotificationService', 'gettext',
        function($scope, $rootScope, notificationsInfoService, currencyService, userNotificationService, gettext) {
            function activate() {
                $scope.isBusy = true;

                $scope.reloadNotificationsInformation();

                //todo: this may cause problems because of multiple different event listeners in different controller instances
                $rootScope.$on('$stateChangeSuccess', function(e, toState) {
                    if (toState.name === 'main.authenticated.notifications') {
                        $scope.reloadNotificationsInformation();
                    }
                });
            }

            $scope.isFirstTimeLoad = true;

            $scope.notifications = [];
            $scope.isBusy = true;
            $scope.stateTimestamp = 0;

            $scope.itemsPerPage = 10;
            $scope.currentPageNumber = 1;
            $scope.maxPaginationSize = 5;

            $scope.reloadNotificationsInformation = function() {
                $scope.isBusy = true;

                notificationsInfoService.updateCurrentNotificationsInfo()
                    .then(function(notificationsData) {
                        $scope.stateTimestamp = notificationsData.timestamp;
                        $scope.notifications = notificationsData.notifications;
                    }, function(error) {
                        userNotificationService.showError(error.message || gettext('Oops, an error occurred, please try again'));
                    }).finally(function() {
                        $scope.isBusy = false;
                        $scope.isFirstTimeLoad = false;

                        $scope.currentPageNumber = 1;
                    });
            };

            $scope.getUnreadNotificationsCount = function() {
                return _.where(notificationsInfoService.currentNotificationsInfo,
                            {
                                unread: true
                            }).length;
            };

            activate();
        }]);