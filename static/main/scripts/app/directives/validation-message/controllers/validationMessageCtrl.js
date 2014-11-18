angular.module('directives')
    .controller('validationMessageCtrl', ['$scope',
        function($scope){
            $scope.isValid = function() {
                var list = $scope.validationExpressions || [];

                return _.all(list, function(validationExpression) {
                    return validationExpression.isValid;
                })
            };
        }])