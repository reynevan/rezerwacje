(function () {

    'use strict';
    angular.module('www').service('TranslationService', TranslationService);

    TranslationService.$inject = ['amMoment', '$translate', 'Restangular'];
    function TranslationService(amMoment, $translate, Restangular) {
        this.init = init;
        this.changeLang = changeLang;
        this.activeLanguage = $translate.proposedLanguage;

        var defaultLang = 'pl';

        function init() {
            var lang = $translate.proposedLanguage() || defaultLang;
            changeLang(lang);
        }

        function changeLang(lang) {
            $translate.use(lang);
            amMoment.changeLocale(lang);
            var params = {};
            if (lang !== defaultLang) {
                params.lang = lang;
            }
            Restangular.setDefaultRequestParams(params);
        }

    }

})();