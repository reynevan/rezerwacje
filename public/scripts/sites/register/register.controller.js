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

    RegisterController.$inject = ['Restangular', '$state'];

    function RegisterController(Restangular, $state) {
        var vm = this;

        vm.signUp = function () {
            vm.loading = true;

            Restangular.all('sign-up').post(vm.user).then(function(data){

                vm.loading = false;

                if (data.errors) {
                    vm.errors = data.errors;
                } else {
                    $state.transitionTo('login');
                }
            }, function(data) {
                vm.loading = false;
                vm.errors = data.errors;
            });
        }
    }

})();