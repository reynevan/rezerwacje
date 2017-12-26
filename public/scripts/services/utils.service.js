(function () {

    'use strict';
    angular.module('www').service('Utils', Utils);

    Utils.$inject = ['$q'];

    function Utils($q) {

        this.range = range;
        this.defaultError = defaultError;
        this.defaultSuccess = defaultSuccess;

        //table creating from "min" to "max" by "step"
        function range(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
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