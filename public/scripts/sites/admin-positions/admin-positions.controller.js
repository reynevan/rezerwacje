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

    AdminPositionsController.$inject = ['Restangular', '$translate'];

    function AdminPositionsController(Restangular, $translate) {
        var vm = this;
        vm.addNewPosition = addNewPosition;
        vm.removeCallback = removeCallback;

        vm.$onInit = function() {
            vm.loading = true;
            Restangular.all('admin').one('positions').get().then(function(data){
                vm.positions = data.data.positions;
                vm.loading = false;
            }, function(data){
                vm.error = data.error ? data.error : $translate.instant('GENERIC ERROR');
                vm.loading = false;
            });
        };

        function addNewPosition() {
            vm.positions.push({
                editing: true,
                new: true
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