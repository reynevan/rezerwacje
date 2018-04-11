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

    positionTileController.$inject = ['ModalService', '$translate', 'PositionsService'];

    function positionTileController(ModalService, $translate, PositionsService) {
        var vm = this;
        vm.removePosition = removePosition;
        vm.savePosition = savePosition;
        vm.cancel = cancel;
        vm.getWeekDay = getWeekDay;
        vm.formatTime = formatTime;

        vm.days = [1,2,3,4,5,6,7];

        vm.hours = [];
        vm.minutes = [];
        for (var i = 0; i <= 24; i++) {
            vm.hours.push(i);
        }
        for (var i = 0; i < 60; i += 5) {
            vm.minutes.push(i);
        }

        function removePosition(position) {
            position.removing = true;
            var callback = function () {
                PositionsService.remove(position).then(removeSuccess, removeError);
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
                PositionsService.create(position).then(createSuccess, saveError);
            } else {
                PositionsService.update(position).then(updateSuccess, saveError);
            }
        }

        function cancel(position) {
            position.editing = false;
            if (position.new) {
                vm.removeCallback();
            }
        }

        function removeSuccess() {
            vm.position.removing = false;
            Materialize.toast($translate.instant('POSITION REMOVED'), 3000);
            vm.removeCallback();
        }

        function removeError(data) {
            vm.position.removing = false;
            vm.error = data.message || $translate.instant('GENERIC ERROR');
        }

        function createSuccess(data) {
            vm.position.new = false;
            vm.position.editing = false;
            vm.position.saving = false;
            vm.position.id = data.position.id;
            var message = $translate.instant('POSITION CREATED');
            Materialize.toast(message, 3000);
        }

        function updateSuccess() {
            vm.position.saving = false;
            vm.position.editing = false;
            Materialize.toast($translate.instant('CHANGES SAVED'), 3000);
        }

        function saveError(data) {
            vm.errors = data.errors;
            vm.position.saving = false;
        }

        function getWeekDay(i, format) {
            format = format || 'dddd';
            return moment().isoWeekday(i).format(format);
        }

        function formatTime(n) {
            if (n < 10) {
                return '0' + n;
            }
            return n;
        }
    }
})();