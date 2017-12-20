(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('stand', {
                    url: '/moje-stanowisko',
                    templateUrl: 'scripts/sites/position/position.html',
                    controller: 'StandController',
                    controllerAs: 'vm',
                    access: {
                        standEmployee: true
                    }
                })
        })
        .controller('StandController', StandController);

    StandController.$inject = ['Restangular', '$state', '$timeout'];

    function StandController(Restangular, $state, $timeout) {
        var vm = this;
        vm.endReservation = endReservation;

        vm.$onInit = function () {
            getQueue();
            setTime();
        };

        function getQueue() {
            if ($state.current.name === 'stand') {
                Restangular.one('queue', 'my').get().then(function (data) {
                    vm.reservations = data.reservations;
                }).finally(function () {
                    $timeout(getQueue, 5000)
                });
            }
        }

        function setTime() {
            if ($state.current.name === 'stand') {
                vm.date = moment().format("dddd, MMMM Do YYYY");
                vm.time = moment().format("H:mm:ss");
                $timeout(setTime, 1000)
            }
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