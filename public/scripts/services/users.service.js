(function () {

    'use strict';
    angular.module('www').service('UsersService', UsersService);

    UsersService.$inject = ['$q', 'Restangular'];

    function UsersService($q, Restangular) {

        this.createEmployee = createEmployee;
        this.updateEmployee = updateEmployee;

        function createEmployee(employee) {
            return Restangular.all('admin').all('employees').post(employee).then(defaultSuccess, defaultError);
        }

        function updateEmployee(employee) {

        }

        function defaultError(response) {
            var deferred = $q.defer();
            var data = response.data ? response.data : response;
            deferred.reject(data);
            return deferred.promise;
        }

        function defaultSuccess(data) {
            var deferred = $q.defer();
            if (data.success) {
                deferred.resolve(data.data);
            } else {
                deferred.reject(data);
            }
            return deferred.promise;
        }
    }

})();