(function () {

    'use strict';

    angular
        .module('www')
        .config(function ($stateProvider) {
            $stateProvider
                .state('edit-profile', {
                    templateUrl: 'scripts/sites/profile/edit-profile/edit-profile.html',
                    url: '/profil/edycja',
                    controller: 'EditProfileController',
                    controllerAs: 'vm',
                    profile: true,
                    auth: true
                })
        })
        .controller('EditProfileController', EditProfileController);

    EditProfileController.$inject = ['Restangular'];
    function EditProfileController(Restangular) {
        var vm = this;
        vm.saveProfile = saveProfile;

        Restangular.one('profile').get().then(function(data){
            vm.user = data.user;
        });

        function saveProfile() {
            vm.errors = null;
            Restangular.one('profile').patch(vm.user).then(function(data) {
                if (data.errors) {
                    vm.errors = data.errors;
                }
            })
        }
    }
})();