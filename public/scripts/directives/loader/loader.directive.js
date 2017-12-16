(function () {

    'use strict';

    angular.module('www').directive('loader', loader);

    function loader() {
        return {
            scope: {
                'class': '=?'
            },
            controller: loaderController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'scripts/directives/loader/loader.html'
        };
    }

    loaderController.$inject = [];

    function loaderController() {
        var vm = this;

        if (!vm.class) {
            vm.class = 'small'
        }
    }
})();