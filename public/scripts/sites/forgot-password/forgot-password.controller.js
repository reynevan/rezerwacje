(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('request-reset-password', {
                    url: '/haslo',
                    templateUrl: 'scripts/sites/forgot-password/forgot-password.html',
                    controller: 'ForgotPasswordController',
                    controllerAs: 'vm'
                })
        })
        .controller('ForgotPasswordController', ForgotPasswordController);

    ForgotPasswordController.$inject = ['AuthService', 'FlashService', '$state'];

    function ForgotPasswordController(AuthService, FlashService, $state) {
        var vm = this;

        vm.send = function() {
            vm.loading = true;
            FlashService.clear();
            AuthService.requestPasswordResetMail(vm.email).then(
                function(data) {
                    vm.loading = false;
                    $state.transitionTo('login');
                    FlashService.successAfterRouteChange(data.message);
                },
                function(data) {
                    vm.loading = false;
                    FlashService.error(data.message);
                }
            )
        }

    }

})();