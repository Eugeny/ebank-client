angular.module('directives')
    .provider('confirmationPopup',
        function() {
            return {
                $get: ['$modal', '$rootScope', function($modal, $rootScope) {
                    return {
                        open: function(confirmCallback, declineCallback) {
                            var modal = $modal.open({
                              templateUrl: '/static/main/scripts/app/directives/confirmation-popup/views/confirmationPopup.html',
                              size: 'sm',
                              windowClass: 'confirmation-popup-modal'
                            });

                            modal.result.then(confirmCallback, declineCallback);

                            $rootScope.$on('$stateChangeSuccess', function(e, toState) {
                                modal.dismiss();
                            });
                        }
                    };
                }]
            };
        });