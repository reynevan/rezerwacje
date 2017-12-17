angular.module('www').controller('ConfirmationPopupController', ConfirmationPopupController);

ConfirmationPopupController.$inject = ['$uibModalInstance', 'message', 'callback', 'cancelCallback'];

function ConfirmationPopupController($uibModalInstance, message, callback, cancelCallback) {
    var vm = this;
    vm.close = close;
    vm.message = message;
    vm.confirm = confirm;
    vm.cancel = cancel;

    function close() {
        $uibModalInstance.dismiss();
    }

    function cancel() {
        if (angular.isFunction(cancelCallback)) {
            cancelCallback();
        }
        close();
    }

    function confirm() {
        callback();
        close();
    }
}