angular.module('ebank-client')
    .controller('manageAutomaticAccountOperations.automaticAccountOperationCtrl', [
        '$scope', 'automaticAccountOperationId', 'userAccountsService', 'automaticAccountOperationsService',
            'userNotificationService',
        function($scope, automaticAccountOperationId, userAccountsService, automaticAccountOperationsService,
                userNotificationService) {
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
                    startDate: Math.floor($scope.startDate.getTime()/1000),
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

                if (automaticAccountOperationId) {
                    currentAutomaticAccountOperation.id = automaticAccountOperationId;
                }

                $scope.isBusy = true;
                automaticAccountOperationsService.saveAutomaticAccountOperation(currentAutomaticAccountOperation)
                    .then(function() {
                        $scope.closeModal();
                        userNotificationService.showSuccess('Automatic account operation is successfully saved');
                    }, function(error) {
                        userAccountsService.showError(error.message);
                    }).finally(function() {
                        $scope.isBusy = false;
                    });
            };

            activate();
        }]);