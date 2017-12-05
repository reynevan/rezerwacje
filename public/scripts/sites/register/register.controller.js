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

    RegisterController.$inject = ['Restangular'];

    function RegisterController(Restangular) {
        var vm = this;

        vm.signUp = function () {
            Restangular.all('sign-up').post(vm.user).then(function(data){
                if (data.errors) {
                    vm.errors = data.errors;
                }
            });
        }
    }

})();