angular.module('www').controller('ConfirmationPopupController', ConfirmationPopupController);

ConfirmationPopupController.$inject = ['$uibModalInstance', 'message', 'callback'];

function ConfirmationPopupController($uibModalInstance, message, callback) {
    var vm = this;
    vm.close = close;
    vm.message = message;
    vm.confirm = confirm;

    function close() {
        $uibModalInstance.dismiss();
    }

    function confirm() {
        callback();
        close();
    }
}