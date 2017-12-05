(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('queue', {
                    url: '/kolejka',
                    templateUrl: 'scripts/sites/queue/queue.html',
                    controller: 'QueueController',
                    controllerAs: 'vm',
                    hideMenu: true
                })
        })
        .controller('QueueController', QueueController);

    QueueController.$inject = ['Restangular', '$timeout', '$state'];

    function QueueController(Restangular, $timeout, $state) {
        var vm = this;

        vm.$onInit = function() {
            getQueue();
            setTime();
        };

        function getQueue() {
            if ($state.current.name === 'queue') {
                Restangular.one('queue').get().then(function(data){
                    vm.reservations = data.reservations;
                }).finally(function() {
                    $timeout(getQueue, 5000)
                })
            }

        }

        function setTime() {
            if ($state.current.name === 'queue') {
                vm.date = moment().format("dddd, DD MMMM YYYY");
                vm.time = moment().format("H:mm:ss");
                $timeout(setTime, 1000)
            }
        }
    }
})();