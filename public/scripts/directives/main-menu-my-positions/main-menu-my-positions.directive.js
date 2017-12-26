(function () {

    'use strict';

    angular.module('www').directive('mainMenuMyPositions', mainMenuMyPositions);

    function mainMenuMyPositions() {
        return {
            scope: {},
            controller: mainMenuMyPositionsController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'scripts/directives/main-menu-my-positions/main-menu-my-positions.html'
        };
    }

    mainMenuMyPositionsController.$inject = ['AuthService', 'Restangular'];

    function mainMenuMyPositionsController(AuthService, Restangular) {
        var vm = this;
        vm.AuthService = AuthService;
        vm.$onInit = onInit;

        function onInit() {
            Restangular.one('employee/positions/my').get().then(function(data) {
                vm.positions = data.data.positions;
            });
        }
    }
})();