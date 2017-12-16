(function () {

    'use strict';

    angular.module('www').directive('mainMenu', mainMenu);

    function mainMenu() {
        return {
            scope: {},
            controller: mainMenuController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'scripts/directives/main-menu/main-menu.html'
        };
    }

    mainMenuController.$inject = ['AuthService', '$state', 'TranslationService'];

    function mainMenuController(AuthService, $state, TranslationService) {
        var vm = this;
        vm.AuthService = AuthService;
        vm.onProfileState = onProfileState;
        vm.isTabActive = isTabActive;
        vm.hideMenu = hideMenu;
        vm.changeLanguage = changeLanguage;
        vm.isLanguageActive = isLanguageActive;

        $(".button-collapse").sideNav({
            closeOnClick: true
        });


        function onProfileState() {
            return !!$state.current.profile;
        }

        function isTabActive(name) {
            return $state.current.name === name;
        }

        function hideMenu() {
            return $state.current.hideMenu;
        }

        function changeLanguage(lang) {
            TranslationService.changeLang(lang);
        }

        function isLanguageActive(lang) {
            return TranslationService.activeLanguage() === lang;
        }
    }
})();