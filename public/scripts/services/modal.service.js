angular.module('www').service('ModalService', ModalService);

ModalService.$inject = ['$uibModal'];

function ModalService($uibModal) {
    this.open = open;
    this.openWarningPopup = openWarningPopup;
    this.openConfirmationPopup = openConfirmationPopup;

    function open(params) {
        var options = {
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controllerAs: 'vm',
            size: 'md',
            animation: false
        };
        options = _.merge(options, params);
        return $uibModal.open(options);
    }

    function openWarningPopup(message) {
        var options = {
            templateUrl: 'scripts/popups/warning/warning.popup.html',
            controller: 'WarningPopupController',
            resolve: {
                message: function() {
                    return message;
                }
            }
        };

        return open(options).result.then(angular.noop, angular.noop);
    }

    function openConfirmationPopup(message, callback, cancelCallback) {
        var options = {
            templateUrl: 'scripts/popups/confirmation/confirmation.popup.html',
            controller: 'ConfirmationPopupController',
            resolve: {
                message: function() {
                    return message;
                },
                callback: function () {
                    return callback;
                },
                cancelCallback: function() {
                    return cancelCallback;
                }
            }
        };

        return open(options).result.then(angular.noop, angular.noop);
    }
}
