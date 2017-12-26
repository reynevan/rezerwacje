(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('booking', {
                    url: '/rezerwacja',
                    templateUrl: 'scripts/sites/booking/booking.html',
                    controller: 'BookingController',
                    controllerAs: 'vm',
                    auth: true,
                    access: {
                        student: true
                    }
                })
        })
        .controller('BookingController', BookingController);

    BookingController.$inject = ['ModalService', 'Restangular', '$q', 'PositionsService'];

    function BookingController(ModalService, Restangular, $q, PositionsService) {
        var vm = this;

        vm.signUp = signUp;
        vm.loadSchedule = loadSchedule;

        vm.$onInit = function () {
            vm.loadingPositions = true;
            PositionsService.getAll().then(getPositionsSuccess, getPositionsError);
        };

        function getPositionsSuccess(data) {
            vm.loadingPositions = false;
            vm.positions = data.positions;
        }

        function getPositionsError() {
            vm.loadingPositions = false;
            FlashService.error($translate.instant('GENERIC ERROR'));
        }

        var canceler = $q.defer();

        function loadSchedule(week, year) {
            if (vm.loading) {
                canceler.resolve();
                canceler = $q.defer();
            }
            vm.loading = true;

            if (angular.isUndefined(week) || angular.isUndefined(year)) {
                week = moment().week();
                year = moment().year();
            }
            Restangular.one('schedule')
                .withHttpConfig({timeout: canceler.promise})
                .get({
                    'week': week,
                    'year': year,
                    'position_id': vm.position
                })
                .then(function (data) {
                    vm.loading = false;
                    vm.schedule = data.schedule;
                    vm.slotTimes = data.slotTimes;
                });
        }

        function signUp(slot, index, day) {
            if (!slot.free || !slot.open) {
                return;
            }
            day += 1;
            var hour = slot.time.split(':')[0];
            var minute = slot.time.split(':')[1];
            var date = moment().year(vm.selectedYear).week(vm.selectedWeek).isoWeekday(day).hour(hour).minute(minute).second(0);
            var data = {
                week: vm.selectedWeek,
                year: vm.selectedYear,
                day: day,
                time: slot.time,
                position_id: vm.position,
                date: date.format("D MMMM YYYY HH:mm"),
                day_index: index + 1
            };

            var position;
            for (var i = 0; i < vm.positions.length; i++) {
                if (+vm.positions[i].id === +vm.position) {
                    position = vm.positions[i];
                }
            }

            var params = {
                templateUrl: 'scripts/popups/sign-up/sign-up.popup.html',
                controller: 'SignUpPopupController',
                resolve: {
                    position: function () {
                        return position;
                    },
                    data: function () {
                        return data;
                    },
                    callback: function () {
                        return function () {
                            loadSchedule();
                        }
                    }
                }
            };
            ModalService.open(params);
        }
    }
})();