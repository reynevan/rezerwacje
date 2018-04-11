angular.module('www').controller('ReservationDetailsPopupController', ReservationDetailsPopupController);

ReservationDetailsPopupController.$inject = ['$uibModalInstance', 'slot'];

function ReservationDetailsPopupController($uibModalInstance, slot) {
    var vm = this;
    vm.close = close;
    vm.$onInit = function() {
        vm.date = moment(slot.date).format("D MMMM YYYY HH:mm");
    };

    vm.slot = slot;

    function close() {
        $uibModalInstance.dismiss();
    }
}