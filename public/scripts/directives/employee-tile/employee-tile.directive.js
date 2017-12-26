(function () {

    'use strict';

    angular.module('www').directive('employeeTile', employeeTile);

    function employeeTile() {
        return {
            scope: {
                'employee': '=',
                'removeCallback': '&',
                'positions': '='
            },
            controller: employeeTileController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'scripts/directives/employee-tile/employee-tile.html'
        };
    }

    employeeTileController.$inject = ['ModalService', 'Restangular', '$translate', 'UsersService'];

    function employeeTileController(ModalService, Restangular, $translate, UsersService) {
        var vm = this;
        vm.removeUser = removeUser;
        vm.saveUser = saveUser;
        vm.cancel = cancel;

        var employeeCopy;
        vm.$onInit = function() {
            employeeCopy = angular.copy(vm.employee);
        };

        function removeUser(user) {
            user.removing = true;
            var callback = function () {
                Restangular.all('admin').one('employees', user.id).remove().then(function(){
                    user.removing = false;
                    Materialize.toast($translate.instant('ACCOUNT REMOVED'), 3000);
                    vm.removeCallback();
                }, function(data){
                    user.removing = false;
                    vm.error = data.error ? data.error : $translate.instant('GENERIC ERROR');
                });
            };
            var cancelCallback = function() {
                user.removing = false;
            };
            var message = $translate.instant('EMPLOYEE REMOVAL CONFIRMATION') + ' ' + vm.employee.email + '?';
            ModalService.openConfirmationPopup(message, callback, cancelCallback);
        }

        function saveUser(user) {
            user.saving = true;
            vm.errors = null;
            if (user.new) {
                UsersService.createEmployee(user).then(createSuccess, saveError);
            } else {
                UsersService.updateEmployee(user).then(updateSuccess, saveError);
            }
        }

        function cancel(user) {
            user.editing = false;
            if (user.new) {
                vm.removeCallback();
            } else {
                vm.employee = employeeCopy;
            }
        }

        function createSuccess(data) {
            user.saving = false;
            user.editing = false;
            user.new = false;
            user.id = data.user.id;
            var message = $translate.instant('ACCOUNT CREATED EMAIL SENT') + ' ' + vm.employee.email;
            Materialize.toast(message, 3000);
        }

        function updateSuccess(data) {
            user.saving = false;
            user.editing = false;
            Materialize.toast($translate.instant('CHANGES SAVED'), 3000);
        }

        function saveError(data) {
            vm.errors = data.errors;
            user.saving = false;
        }
    }
})();