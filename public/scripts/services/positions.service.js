(function () {

    'use strict';
    angular.module('www').service('PositionsService', PositionsService);

    PositionsService.$inject = ['Restangular', 'Utils'];

    function PositionsService( Restangular, Utils) {

        this.create = create;
        this.update = update;
        this.remove = remove;
        this.getAll = getAll;

        function create(position) {
            return Restangular.all('admin').all('positions').post(position).then(Utils.defaultSuccess, Utils.defaultError);
        }

        function update(position) {
            return Restangular.all('admin').one('positions', position.id).patch(position).then(Utils.defaultSuccess, Utils.defaultError);
        }

        function remove(position) {
            return Restangular.all('admin').one('positions', position.id).remove().then(Utils.defaultSuccess, Utils.defaultError);
        }

        function getAll() {
            return Restangular.one('positions').get().then(Utils.defaultSuccess, Utils.defaultError);
        }
    }

})();