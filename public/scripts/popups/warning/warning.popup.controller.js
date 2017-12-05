angular.module('www').controller('WarningPopupController', WarningPopupController);

WarningPopupController.$inject = ['$uibModalInstance', 'message'];

function WarningPopupController($uibModalInstance, message) {
    var vm = this;
    vm.close = close;
    vm.message = message;

    function close() {
        $uibModalInstance.dismiss();
    }
}