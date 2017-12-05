(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/logowanie',
                    templateUrl: 'scripts/sites/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                })
        })
        .controller('LoginController', LoginController);

    LoginController.$inject = ['AuthService'];

    function LoginController(AuthService) {
        var vm = this;

        vm.login = function () {
            var credentials = {
                email: vm.email,
                password: vm.password
            };

            AuthService.login(credentials);
        }
    }

})();