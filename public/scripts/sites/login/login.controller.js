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

    LoginController.$inject = ['AuthService', '$state'];

    function LoginController(AuthService, $state) {
        var vm = this;

        vm.$onInit = function() {
            if (AuthService.isAuthenticated()) {
                $state.transitionTo(AuthService.getHomeStateName());
            }
        }

        vm.login = function () {
            var credentials = {
                email: vm.email,
                password: vm.password
            };

            AuthService.login(credentials).then(angular.noop, function(error){
                vm.error = error.data.error || 'Wystąpił błąd. Proszę spróbowac ponownie później.';
            })
        }
    }

})();