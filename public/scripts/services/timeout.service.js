(function () {

    'use strict';
    angular.module('www').service('TimeoutService', TimeoutService);

    TimeoutService.$inject = ['$timeout'];

    function TimeoutService($timeout) {

        this.setTimeout = setTimeout;
        this.reset = reset;

        var promises = [];

        function setTimeout(fn, time) {
            promises.push($timeout(fn, time));
        }

        function reset() {
            for (var i = 0; i < promises.length; i++) {
                $timeout.cancel(promises[i]);
            }
        }
    }
})();