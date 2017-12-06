(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('register', {
                    url: '/rejestracja',
                    templateUrl: 'scripts/sites/register/register.html',
                    controller: 'RegisterController',
                    controllerAs: 'vm'
                })
        })
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['Restangular', 'AuthService', '$state'];

    function RegisterController(Restangular, AuthService, $state) {
        var vm = this;

        vm.signUp = function () {
            Restangular.all('sign-up').post(vm.user).then(function(data){
                if (data.errors) {
                    vm.errors = data.errors;
                } else {
                    AuthService.setToken(data.token);
                    $state.transitionTo(AuthService.getHomeStateName());
                }
            });
        }
    }

})();