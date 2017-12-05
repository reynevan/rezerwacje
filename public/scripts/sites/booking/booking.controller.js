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

    BookingController.$inject = ['ModalService', 'Restangular', 'Slots'];

    function BookingController(ModalService, Restangular, Slots) {
        var vm = this;

        vm.signUp = signUp;
        vm.loadSchedule = loadSchedule;

        vm.$onInit = function() {
            Restangular.one('stands').get().then(function(data) {
                    vm.stands = data.stands;
                }
            )
        };

        function loadSchedule(week, year) {
            vm.loading = true;

            if (angular.isUndefined(week) || angular.isUndefined(year)) {
                week = moment().week();
                year = moment().year();
            }
            Restangular.one('schedule').get({
                'week':  week,
                'year': year,
                'stand_id': vm.stand
            }).then(function (data) {
                vm.loading = false;
                vm.schedule = data.schedule;
                vm.slotTimes = data.slotTimes;
            });
        }

        function signUp(day, time, index) {
            if (!Slots.isFree(vm.schedule, day, index) || !Slots.isOpen(vm.schedule, day, index)) {
                return;
            }
            var hour = time.split(':')[0];
            var minute = time.split(':')[1];
            var date = moment().year(vm.selectedYear).week(vm.selectedWeek).day(day).hour(hour).minute(minute).second(0);
            var data = {
                week: vm.selectedWeek,
                year: vm.selectedYear,
                day: day,
                time: time,
                stand_id: vm.stand,
                date: date.format("D MMMM YYYY HH:mm"),
                day_index: index + 1
            };

            var stand;
            for (var i = 0; i < vm.stands.length; i++) {
                if (+vm.stands[i].id === +vm.stand) {
                    stand = vm.stands[i];
                }
            }

            var params = {
                templateUrl: 'scripts/popups/sign-up/sign-up.popup.html',
                controller: 'SignUpPopupController',
                resolve: {
                    stand: function () {
                        return stand;
                    },
                    data: function() {
                        return data;
                    },
                    callback: function() {
                        return function() {
                            if (vm.schedule && vm.schedule[day] && vm.schedule[day][index]) {
                                vm.schedule[day][index].free = false;
                            } else {
                                loadSchedule();
                            }
                        }
                    }
                }
            };
            ModalService.open(params);
        }
    }
})();