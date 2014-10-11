angular.module('services')
    .factory('notificationsInfoService', ['$q',
        function($q) {
            function activate() {
                self.updateCurrentNotificationsInfo();
            }

            var self = {};

            self.currentNotificationsInfo = null;

            self.updateCurrentNotificationsInfo = function() {
                var deferred = $q.defer();

                //TODO: load data from server here
                //mock data
                self.currentNotificationsInfo = {
                    count: 10
                };
                deferred.resolve(self.currentNotificationsInfo);

                return deferred.promise;
            };

            activate();

            return self;
        }]);