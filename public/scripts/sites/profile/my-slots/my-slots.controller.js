(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('profile', {
                    templateUrl: 'scripts/sites/profile/my-slots/my-slots.html',
                    url: '/profil/moje-rezerwacje',
                    controller: 'MySlotsController',
                    controllerAs: 'vm',
                    profile: true,
                    auth: true,
                    access: {
                        student: true
                    }
                })
        })
        .controller('MySlotsController', MySlotsController);

    MySlotsController.$inject = ['Restangular', 'ModalService'];

    function MySlotsController(Restangular, ModalService) {
        var vm = this;
        vm.freeSlot = freeSlot;

        Restangular.one('slots').one('my').get().then(function (data) {
            vm.slots = data.data.slots;
        });

        function freeSlot(slot) {
            var callback = function () {
                Restangular.one('slots', slot.id).remove().then(function (data) {
                    for (var i = 0; i < vm.slots.length; i++) {
                        if (vm.slots[i].id === slot.id) {
                            vm.slots.splice(i, 1);
                            break;
                        }
                    }
                    Materialize.toast('Rezerwacja odwołana.', 3000)
                });
            };
            ModalService.openConfirmationPopup('CANCEL_RESERVATION_CONFIRMATION', callback);
        }
    }
})();