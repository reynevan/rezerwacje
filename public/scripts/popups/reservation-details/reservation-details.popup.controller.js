angular.module('www').controller('ReservationDetailsPopupController', ReservationDetailsPopupController);

ReservationDetailsPopupController.$inject = ['$uibModalInstance', 'slot'];

function ReservationDetailsPopupController($uibModalInstance, slot) {
    var vm = this;
    vm.close = close;
    vm.$onInit = function() {
        var hour = slot.reservation.time.split(':')[0];
        var minute = slot.reservation.time.split(':')[1];
        vm.date = moment().year(slot.reservation.year).week(slot.reservation.week).day(slot.reservation.day).hour(hour).minute(minute).second(0).format("D MMMM YYYY HH:mm")
    };

    vm.slot = slot;

    function close() {
        $uibModalInstance.dismiss();
    }
}