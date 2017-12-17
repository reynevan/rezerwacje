(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('admin-stands', {
                    url: '/admin/stands',
                    templateUrl: 'scripts/sites/admin-stands/admin-stands.html',
                    controller: 'AdminStandsController',
                    controllerAs: 'vm',
                    auth: true,
                    access: {
                        admin: true
                    }
                })
        })
        .controller('AdminStandsController', AdminStandsController);

    AdminStandsController.$inject = ['Restangular', '$translate'];

    function AdminStandsController(Restangular, $translate) {
        var vm = this;
        vm.getWeekDay = getWeekDay;
        vm.save = save;

        vm.$onInit = function() {
            vm.loading = true;
            Restangular.one('settings').get().then(function(data){
                vm.settings = data;
                vm.loading = false;
            }, function(data){
                vm.error = data.error ? data.error : $translate.instant('GENERIC ERROR');
                vm.loading = false;
            });
        };


        function save() {
            vm.loading = true;

            Restangular.all('admin').all('stands').post(vm.settings).then(function(){
                vm.loading = false;
                Materialize.toast($translate.instant('CHANGES SAVED'), 3000);
            }, function(data){
                vm.loading = false;
                vm.error = data.error ? data.error : $translate.instant('GENERIC ERROR');
            })
        }

        vm.days = [1,2,3,4,5,6,7];

    }
})();