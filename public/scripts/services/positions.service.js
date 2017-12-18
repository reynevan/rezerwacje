(function () {

    'use strict';
    angular.module('www').service('PositionsService', PositionsService);

    PositionsService.$inject = ['$q', 'Restangular'];

    function PositionsService($q, Restangular) {

        this.createPosition = createPosition;
        this.updatePosition = updatePosition;

        function createPosition(position) {
            return Restangular.all('admin').all('positions').post(position).then(defaultSuccess, defaultError);
        }

        function updatePosition(position) {

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