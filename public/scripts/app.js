(function () {

    'use strict';

    angular.module('www', [
        'ui.router',
        'satellizer',
        'restangular',
        'ui.bootstrap',
        'angularMoment',
        'ui.materialize',
        'pascalprecht.translate',
        'ngCookies',
        'vcRecaptcha',
        'ngFlash'
    ])
        .config(config)
        .run(run);

    config.$inject = ['$urlRouterProvider', '$authProvider', 'RestangularProvider', '$locationProvider', '$translateProvider', 'TRANSLATIONS'];
    function config($urlRouterProvider, $authProvider, RestangularProvider, $locationProvider, $translateProvider, TRANSLATIONS) {
        $authProvider.loginUrl = '/api/authenticate';

        $urlRouterProvider.otherwise('/logowanie');

        RestangularProvider.setBaseUrl('/api/');

        $locationProvider.html5Mode(true);

        $translateProvider
            .translations('en', TRANSLATIONS.EN)
            .translations('pl', TRANSLATIONS.PL)
            .preferredLanguage('pl')
            .useCookieStorage();
    }


    run.$inject = ['Restangular', '$state', '$transitions', 'AuthService', 'TranslationService', 'FlashService', '$rootScope'];
    function run(Restangular, $state, $transitions, AuthService, TranslationService, FlashService, $rootScope) {

        TranslationService.init();

        Restangular.setErrorInterceptor(function (response) {
            if (response.status === 400 || response.status === 401) {
                $state.transitionTo('login');
                return response;
            }
            return true;
        });

        $rootScope.$watch(
            // This function returns the value being watched. It is called for each turn of the $digest loop
            AuthService.isAuthenticated,
            // This is the change listener, called when the value returned from the above function changes
            function(newValue, oldValue) {
                if ( newValue !== oldValue ) {
                    // Only increment the counter if the value changed
                    if (newValue === false && oldValue === true) {
                        $state.transitionTo('login');
                    }
                }
            }
        );


        //$trace.enable('TRANSITION');

        $transitions.onStart({}, function (trans) {
            if (trans.targetState().state().auth && !AuthService.isAuthenticated()) {
                if (trans.targetState().$state.name !== 'login') {
                    AuthService.setRedirect(trans.targetState().$state().name, trans.targetState().params());
                }
                return trans.router.stateService.target('login');
            }
            var access = trans.targetState().state().access;
            if (access) {
                var noAccess = !access.student && AuthService.isStudent();
                noAccess = noAccess || !access.standEmployee && AuthService.isStandEmployee();
                if (noAccess) {
                    return trans.router.stateService.target(AuthService.getHomeStateName());
                }
            }
        });

        $transitions.onFinish({}, function () {
            FlashService.clear();
            FlashService.showMessages();
            FlashService.removeMessages();
        });
    }
})();