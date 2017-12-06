(function () {

    'use strict';
    angular.module('www').service('TranslationService', TranslationService);

    function TranslationService() {
        this.getTranslations = getTranslations;

        function getTranslations(lang) {
            return translations[lang];
        }

        var translations = {
            'pl': {
                LOGIN: 'Logowanie',
                LOGIN_BTN: 'Zaloguj'
            },
            'en': {
                LOGIN: 'Login',
                LOGIN_BTN: 'Sign in'
            }
        };
    }

})();