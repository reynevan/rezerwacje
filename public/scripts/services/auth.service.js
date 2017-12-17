angular.module('www').service('AuthService', AuthService);

AuthService.$inject = ['$auth', 'Restangular', '$state', 'ROLES', '$q'];

function AuthService($auth, Restangular, $state, ROLES, $q) {
    this.isAuthenticated = isAuthenticated;
    this.logout = logout;
    this.signup = signup;
    this.login = login;
    this.setRedirect = setRedirect;
    this.getUser = getUser;
    this.isStandEmployee = isStandEmployee;
    this.isStudent = isStudent;
    this.isAdmin = isAdmin;
    this.setToken = setToken;
    this.requestPasswordResetMail = requestPasswordResetMail;

    this.getHomeStateName = getHomeStateName;

    var redirectName = null;
    var redirectParams = {};

    var user = null;

    function isAuthenticated() {
        return $auth.isAuthenticated();
    }

    function setToken(token) {
        $auth.setToken(token);
    }


    function logout() {
        $auth.logout();
        $state.transitionTo('login');
    }

    function signup(data) {
        return Restangular.all('signup').post(data);
    }

    function login(user) {
        return Restangular.all('authenticate').post(user).then(defaultSuccess, loginError).then(afterLogin, defaultError);
    }

    function setRedirect(name, params) {
        redirectName = name;
        redirectParams = params;
    }

    function afterLogin(data) {
        var deferred = $q.defer();
        if (!data.token) {
            $q.reject(data);
            return deferred.promise;
        }
        var token = data.token;
        $auth.setToken(token);
        $state.transitionTo(redirectName || getHomeStateName(), redirectParams);
        redirectName = null;
        redirectParams = {};
        deferred.resolve(data);
        return deferred.promise;
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

    function isAdmin() {
        var payload = $auth.getPayload();
        return isAuthenticated() && payload && payload.role === ROLES.ADMIN;
    }

    function requestPasswordResetMail(email) {
        return Restangular.all('forgot-password').post({'email': email}).then(defaultSuccess, defaultError);
    }

    function getHomeStateName() {
        if (isStudent()) {
            return 'booking';
        } else if (isStandEmployee()) {
            return 'schedule'
        } else if (isAdmin()) {
            return 'admin-settings'
        } else {
            return 'login'
        }
    }

    function defaultSuccess(data) {
        var deferred = $q.defer();
        if (data.success) {
            deferred.resolve(data.data);
        } else {
            deferred.reject(data);
        }
        return deferred.promise;
    }

    function loginError(response) {
        var deferred = $q.defer();
        deferred.reject(response);
        return deferred.promise;
    }

    function defaultError(response) {
        var deferred = $q.defer();
        var data = response.data ? response.data : response;
        deferred.reject(data);
        return deferred.promise;
    }
}
