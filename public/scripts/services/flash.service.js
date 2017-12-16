(function () {

    'use strict';
    angular.module('www').service('FlashService', FlashService);

    FlashService.$inject = ['Flash'];

    function FlashService(Flash) {

        this.successAfterRouteChange = successAfterRouteChange;
        this.errorAfterRouteChange = errorAfterRouteChange;
        this.clear = clear;
        this.showMessages = showMessages;
        this.success = success;
        this.error = error;
        this.removeMessages = removeMessages;

        var messages = [];

        var TYPE_SUCCESS = 'success';
        var TYPE_ERROR = 'danger';

        function successAfterRouteChange(message) {
            messages.push(
                {
                    type: TYPE_SUCCESS,
                    message: message
                }
            )
        }

        function errorAfterRouteChange(message) {
            messages.push(
                {
                    type: TYPE_ERROR,
                    message: message
                }
            )
        }

        function removeMessages() {
            messages = [];
        }

        function clear() {
            Flash.clear();
        }

        function showMessages() {
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                Flash.create(message.type, message.message, 0, {}, true);
            }
        }

        function success(message) {
            createMessage(TYPE_SUCCESS, message);
        }

        function error(message) {
            createMessage(TYPE_ERROR, message);
        }

        function createMessage(type, message) {
            Flash.create(type, message, 0, {}, true);
        }
    }

})();