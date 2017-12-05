(function () {

    'use strict';
    angular.module('www').service('Slots', Slots);

    function Slots() {

        this.isFree = isFree;
        this.isOpen = isOpen;

        function isFree(schedule, day, slot) {
            return schedule && schedule[day] && schedule[day][slot] && schedule[day][slot].free;
        }
        function isOpen(schedule, day, slot) {
            return schedule && schedule[day] && schedule[day][slot] && schedule[day][slot].open;
        }
    }

})();