(function () {

    'use strict';
    angular.module('www').service('Utils', Utils);

    function Utils() {

        this.range = range;

        //table creating from "min" to "max" by "step"
        function range(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        }
    }

})();