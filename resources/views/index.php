<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Angular-Laravel Authentication</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!--Import materialize.css-->
    <link rel="stylesheet" href="style.css">
</head>

<body ng-app="www">

    <main-menu></main-menu>
    <div class="container">
        <div ui-view></div>
    </div>

    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <!-- Application Dependencies -->
    <script src="node_modules/angular/angular.js"></script>
    <script src="node_modules/@uirouter/angularjs/release/angular-ui-router.js"></script>
    <script src="node_modules/satellizer/dist/satellizer.js"></script>
    <script src="node_modules/moment/min/moment-with-locales.js"></script>
    <script src="node_modules/angular-moment/angular-moment.js"></script>
    <script src="node_modules/lodash/lodash.js"></script>
    <script src="node_modules/restangular/src/restangular.js"></script>
    <script src="node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"></script>
    <script src="node_modules/materialize-css/dist/js/materialize.js"></script>
    <script src="node_modules/angular-materialize/src/angular-materialize.js"></script>

    <!-- Application Scripts -->
    <script src="scripts/app.js"></script>

    <script src="scripts/constants/roles.constant.js"></script>

    <script src="scripts/sites/login/login.controller.js"></script>
    <script src="scripts/sites/register/register.controller.js"></script>
    <script src="scripts/sites/booking/booking.controller.js"></script>
    <script src="scripts/sites/profile/edit-profile/edit-profile.controller.js"></script>
    <script src="scripts/sites/profile/my-slots/my-slots.controller.js"></script>
    <script src="scripts/sites/schedule/schedule.controller.js"></script>
    <script src="scripts/sites/queue/queue.controller.js"></script>
    <script src="scripts/sites/stand/stand.controller.js"></script>

    <script src="scripts/directives/calendar/calendar.directive.js"></script>
    <script src="scripts/directives/main-menu/main-menu.directive.js"></script>

    <script src="scripts/services/utils.service.js"></script>
    <script src="scripts/services/auth.service.js"></script>
    <script src="scripts/services/modal.service.js"></script>
    <script src="scripts/services/slots.service.js"></script>

    <script src="scripts/popups/warning/warning.popup.controller.js"></script>
    <script src="scripts/popups/confirmation/confirmation.popup.controller.js"></script>
    <script src="scripts/popups/sign-up/sign-up.popup.controller.js"></script>
    <script src="scripts/popups/reservation-details/reservation-details.popup.controller.js"></script>

</body>
</html>