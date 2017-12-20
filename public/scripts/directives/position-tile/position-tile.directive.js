(function () {

    'use strict';

    angular.module('www').directive('positionTile', positionTile);

    function positionTile() {
        return {
            scope: {
                'position': '=',
                'removeCallback': '&'
            },
            controller: positionTileController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'scripts/directives/position-tile/position-tile.html'
        };
    }

    positionTileController.$inject = ['ModalService', 'Restangular', '$translate', 'PositionsService'];

    function positionTileController(ModalService, Restangular, $translate, PositionsService) {
        var vm = this;
        vm.removePosition = removePosition;
        vm.savePosition = savePosition;
        vm.cancel = cancel;

        function removePosition(position) {
            position.removing = true;
            var callback = function () {
                Restangular.all('admin').one('positions', position.id).remove().then(function () {
                    position.removing = false;
                    Materialize.toast($translate.instant('POSITION REMOVED'), 3000);
                    vm.removeCallback();
                }, function (data) {
                    position.removing = false;
                    vm.error = data.error ? data.error : $translate.instant('GENERIC ERROR');
                });
            };
            var cancelCallback = function () {
                position.removing = false;
            };
            var message = $translate.instant('POSITION REMOVAL CONFIRMATION') + ' ' + position.name + '?';
            ModalService.openConfirmationPopup(message, callback, cancelCallback);
        }

        function savePosition(position) {
            position.saving = true;
            vm.errors = null;
            if (position.new) {
                PositionsService.createPosition(position).then(function (data) {
                    position.new = false;
                    position.editing = false;
                    position.saving = false;
                    var message = $translate.instant('POSITION CREATED');
                    Materialize.toast(message, 3000);
                }, function (data) {
                    vm.errors = data.errors;
                    position.saving = false;
                });
            } else {
                PositionsService.updatePosition(position).then(function () {
                    position.saving = false;
                    position.editing = false;
                    Materialize.toast($translate.instant('CHANGES SAVED'), 3000);
                }, function (data) {
                    vm.errors = data.errors;
                    position.saving = false;
                });
            }
        }

        function cancel(position) {
            position.editing = false;
            if (position.new) {
                vm.removeCallback();
            }
        }
    }
})();