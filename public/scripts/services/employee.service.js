(function () {

    'use strict';
    angular.module('www').service('EmployeeService', EmployeeService);

    EmployeeService.$inject = ['Restangular', 'Utils'];

    function EmployeeService(Restangular, Utils) {

        this.getMyQueue  = getMyQueue;
        this.endReservation = endReservation;

        function getMyQueue(positionId) {
            var params = {};
            if (positionId) {
                params.position_id = positionId;
            }
            return Restangular.one('employee').one('queue', 'my').get(params).then(Utils.defaultSuccess, Utils.defaultError);
        }

        function endReservation(id) {
            return Restangular.one('reservations', id).one('close').patch().then(Utils.defaultSuccess, Utils.defaultError);
        }
    }

})();