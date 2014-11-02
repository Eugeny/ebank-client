angular.module('directives')
    .directive('creditCard', function() {
        'use strict';

        return {
            restrict: 'EA',
            templateUrl: '/static/main/scripts/app/directives/credit-card/views/creditCard.html',
            scope: {
                card: '='
            },
            controller: ['$scope', 'userInfoService',
                function($scope, userInfoService) {
                    $scope.userInfoService = userInfoService;

                    $scope.getCardNumberGroups = function(cardNumber) {
                        return [
                            cardNumber.substr(0, 4),
                            '****',
                            '****',
                            cardNumber.substr(11, 4)
                        ];
                    };
                }]
        };
    });