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

    AdminEmployeesController.$inject = ['Restangular', '$translate'];

    function AdminEmployeesController(Restangular, $translate) {
        var vm = this;
        vm.removeCallback = removeCallback;
        vm.addNewEmployee = addNewEmployee;

        vm.$onInit = function() {
            vm.loading = true;
            Restangular.all('admin').one('employees').get().then(function(data){
                vm.employees = data.data.employees;
                vm.loading = false;
            }, function(data){
                vm.error = data.error ? data.error : $translate.instant('GENERIC ERROR');
                vm.loading = false;
            });
        };


        function addNewEmployee() {
            vm.employees.push({
                editing: true,
                new: true
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
    }
})();