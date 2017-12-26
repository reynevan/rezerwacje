(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('admin-employees', {
                    url: '/admin/pracownicy',
                    templateUrl: 'scripts/sites/admin-employees/admin-employees.html',
                    controller: 'AdminEmployeesController',
                    controllerAs: 'vm',
                    auth: true,
                    access: {
                        admin: true
                    }
                })
        })
        .controller('AdminEmployeesController', AdminEmployeesController);

    AdminEmployeesController.$inject = ['$translate', 'PositionsService', 'FlashService', 'AdminService'];

    function AdminEmployeesController($translate, PositionsService, FlashService, AdminService) {
        var vm = this;
        vm.removeCallback = removeCallback;
        vm.addNewEmployee = addNewEmployee;

        vm.$onInit = function() {
            vm.loading = true;
            AdminService.getEmployees().then(getEmployeesSuccess, onError);
            PositionsService.getAll().then(getPositionsSuccess, onError);
        };

        function getEmployeesSuccess(data) {
            vm.employees = data.employees;
            vm.loading = false;
        }

        function getPositionsSuccess(data) {
            vm.positions = data.positions;
            vm.loading = false;
        }

        function addNewEmployee() {
            vm.employees.push({
                editing: true,
                new: true,
                positions: angular.copy(vm.positions)
            });
        }

        function removeCallback(employee, index) {
            if (employee.new) {
                vm.employees.splice(index, 1);
            } else {
                _.remove(vm.employees, function (user) {
                    return employee.id === user.id;
                });
            }
        }

        function onError(data) {
            vm.error = true;
            var error = data.message || $translate.instant('GENERIC ERROR');
            FlashService.error(error);
            vm.loading = false;
        }
    }
})();