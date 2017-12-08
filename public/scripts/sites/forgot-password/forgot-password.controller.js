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

    ForgotPasswordController.$inject = ['Restangular'];

    function ForgotPasswordController(Restangular) {
        var vm = this;

        vm.send = function() {
            Restangular.all('forgot-password').post({'email': vm.email}).then(
                function() {},
                function(){}
            )
        }

    }

})();