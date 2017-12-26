(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('verification', {
                    url: '/weryfikacja/:token',
                    templateUrl: 'scripts/sites/verification/verification.html',
                    controller: 'VerificationController',
                    controllerAs: 'vm'
                })
        })
        .controller('VerificationController', VerificationController);

    VerificationController.$inject = ['AuthService', '$state', 'FlashService', '$translate'];

    function VerificationController(AuthService, $state, FlashService, $translate) {
        var vm = this;

        vm.$onInit = function() {
            AuthService.verify($state.params.token).then(activateSuccess, activateError);
        };

        function activateSuccess() {
            FlashService.successAfterRouteChange($translate.instant('ACCOUNT VERIFIED'));
            $state.transitionTo('login')
        }

        function activateError(data) {
            var error = data.message || $translate.instant('GENERIC ERROR');
            FlashService.error(error);
        }

    }

})();