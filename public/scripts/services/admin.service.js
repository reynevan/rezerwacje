(function () {

    'use strict';
    angular.module('www').service('AdminService', AdminService);

    AdminService.$inject = ['Restangular', 'Utils'];

    function AdminService(Restangular, Utils) {

        this.getEmployees = getEmployees;

        function getEmployees() {
            return Restangular.one('admin', 'employees').get().then(Utils.defaultSuccess, Utils.defaultError);
        }
    }

})();