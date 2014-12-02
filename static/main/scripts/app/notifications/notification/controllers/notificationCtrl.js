angular.module('ebank-client')
    .controller('notifications.notificationCtrl', ['$scope', '$state', '$stateParams', '$modal',
        'notificationsInfoService', 'userNotificationService', 'gettext',
    function($scope, $state, $stateParams, $modal, notificationsInfoService, userNotificationService, gettext) {
        'use strict';

        $scope.isBusy = false;

        function activate() {
            var id = parseInt($stateParams.id);
            var modal;

            if (id === undefined || id < 0) {
                goToNotificationsState();

                userNotificationService.showError(gettext('Incorrect notification identifier'));
            }

            $scope.isBusy = true;

            notificationsInfoService.getUserNotificationInfoById(id)
                .then(function(notificationInfo) {
                    modal = openModal(notificationInfo);

                    modal.result.then(
                        //cancel callback - do nothing (not used)
                        function () {},
                        //dismiss callback
                        function (reason) {
                            if (!reason || !reason.isTransitionToState) {
                                goToNotificationsState();
                            }
                        });

                    if (notificationInfo.notification && notificationInfo.notification.unread) {
                        notificationsInfoService.markNotificationInfoRead(id)
                            .then(function() {}, //congratulations, notification is marked read
                                function(error) {
                                    userNotificationService.showWarning(
                                        gettext('The notification has not been marked as read due to error occurred during marking process.'));
                                });
                    }
                }, function(error) {
                    goToNotificationsState();

                    userNotificationService.showError(error.message || gettext('Oops, an error occurred, please try again'));
                }).finally(function() {
                    $scope.isBusy = false;
                });
        }

        function openModal(notificationInfo) {
            return $modal.open({
              templateUrl: '/static/main/scripts/app/notifications/notification/views/notificationModal.html',
              controller: 'notifications.notification.modalCtrl',
              size: 'lg',
              windowClass: 'notification-modal',
              resolve: {
                notificationInfo: function() {
                    return notificationInfo;
                }
              }
            });
        }

        function goToNotificationsState() {
            $state.go('main.authenticated.notifications');
        }

        activate();
    }]).controller('notifications.notification.modalCtrl', ['$scope', '$rootScope', 'notificationInfo',
    function($scope, $rootScope, notificationInfo) {
        'use strict';

        function activate() {
            //TODO: move this logic somewhere else
            $rootScope.$on('$stateChangeSuccess', function(e, toState) {
                if(toState.name !== 'main.authenticated.notifications.notification') {
                    $scope.closeModal(true);
                }
            });
        }

        $scope.notification = notificationInfo.notification;

        $scope.stateTimestamp = notificationInfo.timestamp;

        $scope.isBusy = false;

        $scope.closeModal = function(isTransitionToState) {
            isTransitionToState = isTransitionToState || false;
            $scope.$dismiss({
                isTransitionToState: isTransitionToState
            });
        };

        activate();
    }]);