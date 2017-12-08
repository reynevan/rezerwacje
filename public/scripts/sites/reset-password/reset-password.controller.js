(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('reset-password', {
                    url: '/haslo/:token',
                    templateUrl: 'scripts/sites/reset-password/reset-password.html',
                    controller: 'ResetPasswordController',
                    controllerAs: 'vm'
                })
        })
        .controller('ResetPasswordController', ResetPasswordController);

    ResetPasswordController.$inject = ['Restangular', '$stateParams'];

    function ResetPasswordController(Restangular, $stateParams) {
        var vm = this;

        vm.send = function() {
            vm.data.token = $stateParams.token;
            Restangular.all('reset-password').post(vm.data).then(
                function() {},
                function(){}
            )
        }

    }

})();