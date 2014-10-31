angular.module('services')
    .factory('userNotificationService', ['toaster',
        function(toaster) {
            return {
                showWarning: function(message) {
                    toaster.pop('warning', '', message);
                },
                showError: function(message) {
                    toaster.pop('error', '', message);
                },
                showInfo: function(message) {
                    toaster.pop('info', '', message);
                },
                showSuccess: function(message) {
                    toaster.pop('success', '', message);
                }
            };
        }]);