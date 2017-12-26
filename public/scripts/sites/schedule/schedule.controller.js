(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('schedule', {
                    url: '/terminarz',
                    templateUrl: 'scripts/sites/schedule/schedule.html',
                    controller: 'ScheduleController',
                    controllerAs: 'vm',
                    auth: true,
                    access: {
                        standEmployee: true
                    }
                })
        })
        .controller('ScheduleController', ScheduleController);

    ScheduleController.$inject = ['Restangular', 'Slots', 'ModalService'];

    function ScheduleController(Restangular, Slots, ModalService) {
        var vm = this;
        vm.loadSchedule = loadSchedule;
        vm.showSlotInfo = showSlotInfo;

        vm.$onInit = function() {
            loadSchedule();
        };

        function showSlotInfo(slot) {
            if (slot.free) {
                return;
            }
            var params = {
                templateUrl: 'scripts/popups/reservation-details/reservation-details.popup.html',
                controller: 'ReservationDetailsPopupController',
                resolve: {
                    slot: function() {
                        return slot;
                    }
                }
            };
            ModalService.open(params);
        }

        function loadSchedule(week, year) {
            vm.loading = true;

            if (angular.isUndefined(week) || angular.isUndefined(year)) {
                week = moment().week();
                year = moment().year();
            }
            Restangular.one('schedule').get({
                'week':  week,
                'year': year
            }).then(function (data) {
                vm.loading = false;
                vm.schedule = data.schedule;
                vm.slotTimes = data.slotTimes;
            });
        }
    }
})();