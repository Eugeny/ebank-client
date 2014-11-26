angular.module('ebank-client')
    .controller('manageAutomaticAccountOperations.automaticAccountOperationCtrl', [
        '$scope', 'automaticAccountOperation', 'editingAutomaticAccountOperationAccountId', 'userAccountsService', 'automaticAccountOperationsService',
            'userNotificationService', 'gettext', 'paymentsService', 'customEvents',
        function($scope, automaticAccountOperation, editingAutomaticAccountOperationAccountId, userAccountsService,
                automaticAccountOperationsService, userNotificationService, gettext, paymentsService, customEvents) {
            var updateAccountsInfoDeferred = null;

            function activate() {
                $scope.$watch('automaticAccountOperationType', function() {
                    clearForm();
                    updateAccountsInfo();
                });

                //load operation data or set it to default value
                if (automaticAccountOperation) {
                    $scope.automaticAccountOperationType = automaticAccountOperation.type;

                    updateAccountsInfo()
                        .then(function() {
                            var currentUserAccount = _.findWhere($scope.userAccounts, {
                                id: editingAutomaticAccountOperationAccountId
                            });

                            if (!currentUserAccount) {
                                userNotificationService.showError('No user account for current automatic operation found');
                                $scope.closeModal();
                            }

                            $scope.currentPayment.currentUserAccount = currentUserAccount;

                            $scope.automaticAccountOperationPeriod = automaticAccountOperation.period;
                            $scope.startDate = new Date(automaticAccountOperation.startDate * 1000); //load from unixtime

                            $scope.currentPayment.paymentAmount = parseInt(automaticAccountOperation.data.amount);

                            if (automaticAccountOperation.type == 'erip') {
                                $scope.isBusy = true;

                                paymentsService.getEripPaymentById(automaticAccountOperation.data.paymentId)
                                    .then(function() {
                                        $scope.$broadcast(customEvents.eripTree.paymentSelected,
                                            parseInt(automaticAccountOperation.data.paymentId),
                                            automaticAccountOperation.data.paymentFields);
                                    }, function(error) {
                                        userNotificationService.showError('No erip payment found for current automatic operation');
                                        $scope.closeModal();
                                    }).finally(function() {
                                        $scope.isBusy = false;
                                    });
                            } else {
                                $scope.currentPayment.recipientAccountNumber = automaticAccountOperation.data.recipientAccountId;
                            }
                        });
                }

                if (!automaticAccountOperation) {
                    $scope.automaticAccountOperationType = 'erip';
                    $scope.automaticAccountOperationPeriod = 'day';
                }
            }

            $scope.automaticAccountOperationId = automaticAccountOperation.id;

            function updateAccountsInfo() {
                $scope.isBusy = true;

                return userAccountsService.getAccounts()
                    .then(function(accountsInfo) {
                        $scope.userAccounts = accountsInfo.accounts || [];

                        if ($scope.userAccounts.length) {
                            $scope.currentPayment.currentUserAccount = $scope.userAccounts[0];
                        }
                    }, function(error) {
                        userNotificationService.showError('Can not load current automatic operation account info');
                        $scope.closeModal();
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

                if (automaticAccountOperation) {
                    currentAutomaticAccountOperation.id = automaticAccountOperation.id;
                }

                $scope.isBusy = true;
                automaticAccountOperationsService.saveAutomaticAccountOperation(currentAutomaticAccountOperation)
                    .then(function() {
                        $scope.closeModal();
                        userNotificationService.showSuccess(gettext('Automatic account operation is successfully saved'));
                    }, function(error) {
                        userAccountsService.showError(error.message);
                    }).finally(function() {
                        $scope.isBusy = false;
                    });
            };

            activate();
        }]);