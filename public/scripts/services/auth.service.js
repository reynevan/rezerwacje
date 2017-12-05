angular.module('www').service('AuthService', AuthService);

AuthService.$inject = ['$auth', 'Restangular', '$state', 'ROLES'];

function AuthService($auth, Restangular, $state, ROLES) {
    this.isAuthenticated = isAuthenticated;
    this.logout = logout;
    this.authenticate = authenticate;
    this.signup = signup;
    this.login = login;
    this.setRedirect = setRedirect;
    this.getUser = getUser;
    this.isStandEmployee = isStandEmployee;
    this.isStudent = isStudent;

    this.getHomeStateName = getHomeStateName;

    var redirectName = null;
    var redirectParams = {};

    var user = null;

    function isAuthenticated() {
        return $auth.isAuthenticated();
    }

    function authenticate(provider) {
        return $auth.authenticate(provider)
            .then(afterLogin)
            .catch(function(error) {
                console.log(error);
            });
    }

    function logout() {
        $auth.logout();
        $state.transitionTo('login');
    }

    function signup(data) {
        return Restangular.all('signup').post(data);
    }

    function login(user) {
        $auth.login(user)
            .then(afterLogin)
            .catch(function(error) {
                console.log(error);
            });
    }

    function setRedirect(name, params) {
        redirectName = name;
        redirectParams = params;
    }

    function afterLogin(data) {
        user = data.data.user;
        $state.transitionTo(redirectName || getHomeStateName(), redirectParams);
        redirectName = null;
        redirectParams = {};
    }

    function getUser() {
        return user;
    }

    function isStudent() {
        var payload = $auth.getPayload();
        return isAuthenticated() && payload && payload.role === ROLES.STUDENT;
    }

    function isStandEmployee() {
        var payload = $auth.getPayload();
        return isAuthenticated() && payload && payload.role === ROLES.STAND_EMPLOYEE;
    }

    function getHomeStateName() {
        if (isStudent()) {
            return 'booking';
        } else if (isStandEmployee()) {
            return 'schedule'
        } else {
            return 'login'
        }
    }
}