(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('admin-positions', {
                    url: '/admin/stanowiska',
                    templateUrl: 'scripts/sites/admin-positions/admin-positions.html',
                    controller: 'AdminPositionsController',
                    controllerAs: 'vm',
                    auth: true,
                    access: {
                        admin: true
                    }
                })
        })
        .controller('AdminPositionsController', AdminPositionsController);

    AdminPositionsController.$inject = ['$translate', 'PositionsService'];

    function AdminPositionsController($translate, PositionsService) {
        var vm = this;
        vm.addNewPosition = addNewPosition;
        vm.removeCallback = removeCallback;

        vm.$onInit = function() {
            vm.loading = true;
            PositionsService.getAll().then(getPositionsSuccess, onError);
        };

        function getPositionsSuccess(data) {
            vm.positions = data.positions;
            vm.loading = false;
        }

        function onError(data) {
            vm.error = true;
            var error = data.message || $translate.instant('GENERIC ERROR');
            FlashService.error(error);
            vm.loading = false;
        }

        function addNewPosition() {
            vm.positions.push({
                editing: true,
                new: true,
                id: new Date().getTime(),
                working_hours: {}
            });
        }

        function removeCallback(position, index) {
            if (position.new) {
                vm.positions.splice(index, 1);
            } else {
                _.remove(vm.positions, function (user) {
                    return position.id === user.id;
                });
            }
        }

    }
})();