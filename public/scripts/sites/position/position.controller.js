(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('position', {
                    url: '/moje-stanowisko',
                    templateUrl: 'scripts/sites/position/position.html',
                    controller: 'PositionController',
                    controllerAs: 'vm',
                    access: {
                        standEmployee: true
                    }
                })
                .state('position-id', {
                    url: '/moje-stanowisko/:id',
                    templateUrl: 'scripts/sites/position/position.html',
                    controller: 'PositionController',
                    controllerAs: 'vm',
                    access: {
                        standEmployee: true
                    }
                })
        })
        .controller('PositionController', PositionController);

    PositionController.$inject = ['$state', 'TimeoutService', 'EmployeeService', '$translate', 'FlashService'];

    function PositionController($state, TimeoutService, EmployeeService, $translate, FlashService) {
        var vm = this;
        vm.endReservation = endReservation;
        vm.$onInit = function () {
            vm.loading = true;
            getQueue();
            setTime();
            vm.allPositions = !$state.params.id;
        };

        var refreshTime = 5000;

        function getQueue() {
            EmployeeService.getMyQueue($state.params.id).then(getQueueSuccess, getQueueError).finally(function () {
                TimeoutService.setTimeout(getQueue, refreshTime)
            });
        }

        function getQueueSuccess(data) {
            vm.error = false;
            vm.reservations = data.reservations;
            vm.loading = false;
            FlashService.clear();
        }

        function getQueueError(data) {
            vm.error = true;
            var error = data.message || $translate.instant('GENERIC ERROR');
            FlashService.clear();
            FlashService.error(error);
            vm.loading = false;
        }

        function setTime() {
            vm.date = moment().format("dddd, MMMM Do YYYY");
            vm.time = moment().format("H:mm:ss");
            TimeoutService.setTimeout(setTime, 1000)
        }

        function endReservation(reservation) {
            EmployeeService.endReservation(reservation.id).then(endReservationSuccess, closeError);

            function endReservationSuccess() {
                _.remove(vm.reservations, function (r) {
                    return reservation.id === r.id;
                });
                Materialize.toast('Rezerwacja zamknieta.', 3000)
            }
        }



        function closeError() {
            Materialize.toast('Wystapił błąd. Prosze odświeżyć stronę i spróbowac ponownie.', 3000)
        }
    }
})();