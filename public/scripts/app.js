(function () {

    'use strict';

    angular.module('www', [
        'ui.router',
        'satellizer',
        'restangular',
        'ui.bootstrap',
        'angularMoment',
        'ui.materialize'
    ])
        .config(config)
        .run(run);

    config.$inject = ['$urlRouterProvider', '$authProvider', 'RestangularProvider'];
    function config($urlRouterProvider, $authProvider, RestangularProvider) {
        $authProvider.loginUrl = '/api/authenticate';

        $urlRouterProvider.otherwise('/logowanie');

        RestangularProvider.setBaseUrl('/api/');
    }


    run.$inject = ['Restangular', '$state', '$trace', '$transitions', 'AuthService', 'amMoment'];
    function run(Restangular, $state, $trace, $transitions, AuthService, amMoment) {

        amMoment.changeLocale('pl');

        Restangular.setErrorInterceptor(function (response) {
            if (response.status === 400 || response.status === 401) {
                $state.transitionTo('login');
                return false;
            }
            return true;
        });

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
    }
})();