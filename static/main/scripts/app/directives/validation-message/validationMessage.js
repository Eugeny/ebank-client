angular.module('directives')
    .directive('validationMessage', [function(){
        'use strict';

        return {
            restrict: 'E',
            templateUrl: '/static/main/scripts/app/directives/validation-message/views/validationMessage.html',
            controller: 'validationMessageCtrl',
            scope: {
                //the format for validation expressions is the following
                //[
                //  {
                //      isValid,
                //      validationMessage
                //  }
                //]
                validationExpressions: '='
            }
        };
    }]);