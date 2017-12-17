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

    LoginController.$inject = ['AuthService', '$state', 'FlashService', '$translate'];

    function LoginController(AuthService, $state, FlashService, $translate) {
        var vm = this;

        vm.$onInit = function() {
            if (AuthService.isAuthenticated()) {
                $state.transitionTo(AuthService.getHomeStateName());
            }
        };

        vm.login = function () {
            FlashService.clear();
            vm.loading = true;
            var credentials = {
                email: vm.email,
                password: vm.password
            };

            AuthService.login(credentials).then(function() {
                vm.loading = false;
            }, function(data){
                vm.loading = false;
                var message = data.message || $translate.instant('GENERIC ERROR');
                FlashService.error(message);
            })
        }
    }

})();