angular.module('ebank-client')
    .controller('manageAutomaticAccountOperations.automaticAccountOperationCtrl', [
        '$scope', 'automaticAccountOperationId', 'userAccountsService',
        function($scope, automaticAccountOperationId, userAccountsService) {
            function activate() {
                $scope.$watch('automaticAccountOperationType', function() {
                    clearForm();

                    updateAccountsInfo();
                });

                $scope.automaticAccountOperationType = 'erip';
                $scope.automaticAccountOperationPeriod = 'day';
            }

            $scope.automaticAccountOperationId = automaticAccountOperationId;

            function updateAccountsInfo() {
                $scope.isBusy = true;

                userAccountsService.getAccounts()
                    .then(function(accountsInfo) {
                        $scope.userAccounts = accountsInfo.accounts || [];

                        if ($scope.userAccounts.length) {
                            $scope.currentPayment.currentUserAccount = $scope.userAccounts[0];
                        }
                    }, function(error) {
                        console.log(error);
                    }).finally(function() {
                        $scope.isBusy = false;
                        $scope.isFirstTimeLoad = false;
                    });
            }

            function clearForm() {
                $scope.currentPayment = {};
                $scope.currentEripPayment = null;
                $scope.currentPaymentFields = null;

                $scope.startDate = new Date();

                $scope.currentPayment.paymentAmount = 1;

                $scope.minDate = new Date();
            }

            $scope.closeModal = function() {
                $scope.$dismiss();
            };

            $scope.save = function() {
                var currentAutomaticAccountOperation = {
                    startDate: $scope.startDate.getTime(),
                    period: $scope.automaticAccountOperationPeriod,
                    type: $scope.automaticAccountOperationType,
                    data: {
                        accountNumber: $scope.currentPayment.currentUserAccount.id,
                        amount: $scope.currentPayment.paymentAmount
                    }
                };

                if ($scope.automaticAccountOperationType == 'erip') {
                    currentAutomaticAccountOperation.data.paymentId = $scope.currentEripPayment.paymentId;
                    currentAutomaticAccountOperation.data.paymentFields = $scope.currentPaymentFields;
                } else {
                    currentAutomaticAccountOperation.data.recipientAccountNumber= $scope.currentPayment.recipientAccountNumber;
                }

                console.log(currentAutomaticAccountOperation);
            };

            activate();
        }]);