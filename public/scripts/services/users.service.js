(function () {

    'use strict';
    angular.module('www').service('UsersService', UsersService);

    UsersService.$inject = ['$q', 'Restangular', 'Utils'];

    function UsersService($q, Restangular, Utils) {

        this.createEmployee = createEmployee;
        this.updateEmployee = updateEmployee;
        this.getAll = getAll;
        this.remove = remove;

        function createEmployee(employee) {
            return Restangular.all('admin').all('employees').post(employee).then(Utils.defaultSuccess, Utils.defaultError);
        }

        function updateEmployee(employee) {
            return Restangular.all('admin').one('employees', employee.id).patch(employee).then(Utils.defaultSuccess, Utils.defaultError);
        }

        function getAll(params) {
            return Restangular.all('admin').one('users').get(params).then(Utils.defaultSuccess, Utils.defaultError);
        }

        function remove(user) {
            return Restangular.all('admin').one('users', user.id).remove().then(Utils.defaultSuccess, Utils.defaultError);
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