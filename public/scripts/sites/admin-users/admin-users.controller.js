(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('admin-users', {
                    url: '/admin/uzytkownicy',
                    templateUrl: 'scripts/sites/admin-users/admin-users.html',
                    controller: 'AdminUsersController',
                    controllerAs: 'vm',
                    auth: true,
                    access: {
                        admin: true
                    }
                })
        })
        .controller('AdminUsersController', AdminUsersController);

    AdminUsersController.$inject = ['$translate', 'UsersService', 'FlashService', 'ModalService'];

    function AdminUsersController($translate, UsersService, FlashService, ModalService) {
        var vm = this;
        vm.remove = remove;
        vm.search = search;

        vm.$onInit = function() {
            vm.loading = true;
            UsersService.getAll().then(getUsersSuccess, onError);
        };

        function getUsersSuccess(data) {
            vm.users = data.users;
            vm.loading = false;
        }

        function onError(data) {
            vm.error = true;
            var error = data.message || $translate.instant('GENERIC ERROR');
            FlashService.error(error);
            vm.loading = false;
        }

        function remove(user) {
            var callback = function() {
                UsersService.remove(user).then(removeSuccess, removeFailed);
            };

            ModalService.openConfirmationPopup('REMOVE_USER_CONFIRMATION', callback);

            function removeSuccess() {
                Materialize.toast($translate.instant('USER REMOVED'), 3000);
                _.remove(vm.users, function (element) {
                    return element.id === user.id;
                });
            }
        }

        function search() {
            vm.users = [];
            vm.loading = true;
            UsersService.getAll({q: vm.keywords}).then(getUsersSuccess, onError);
        }

        function removeFailed(data) {
            var error = data.message || $translate.instant('GENERIC ERROR');
            FlashService.error(error);
        }

    }
})();