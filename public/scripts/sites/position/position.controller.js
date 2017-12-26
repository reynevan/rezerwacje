(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('position', {
                    url: '/moje-stanowisko',
                    templateUrl: 'scripts/sites/position/position.html',
                    controller: 'StandController',
                    controllerAs: 'vm',
                    access: {
                        standEmployee: true
                    }
                })
                .state('position-id', {
                    url: '/moje-stanowisko/:id',
                    templateUrl: 'scripts/sites/position/position.html',
                    controller: 'StandController',
                    controllerAs: 'vm',
                    access: {
                        standEmployee: true
                    }
                })
        })
        .controller('StandController', StandController);

    StandController.$inject = ['Restangular', '$state', 'TimeoutService'];

    function StandController(Restangular, $state, TimeoutService) {
        var vm = this;
        vm.endReservation = endReservation;

        vm.$onInit = function () {
            getQueue();
            setTime();
        };

        function getQueue() {
            var params = {};
            if ($state.params.id) {
                params.position_id = $state.params.id;
            }
            Restangular.one('employee').one('queue', 'my').get(params).then(function (data) {
                vm.reservations = data.reservations;
            }).finally(function () {
                TimeoutService.setTimeout(getQueue, 5000)
            });
        }

        function setTime() {
            vm.date = moment().format("dddd, MMMM Do YYYY");
            vm.time = moment().format("H:mm:ss");
            TimeoutService.setTimeout(setTime, 1000)
        }

        function endReservation(reservation) {
            Restangular.one('reservations', reservation.id).one('close').patch().then(function (data) {
                if (data.data.error) {
                    closeError();
                } else {
                    for (var i = 0; i < vm.reservations.length; i++) {
                        if (vm.reservations[i].id === reservation.id) {
                            vm.reservations.splice(i, 1);
                        }
                    }
                    Materialize.toast('Rezerwacja zamknieta.', 3000)
                }
            }, closeError);
        }

        function closeError() {
            Materialize.toast('Wystapił błąd. Prosze odświeżyć stronę i spróbowac ponownie.', 3000)
        }
    }
})();