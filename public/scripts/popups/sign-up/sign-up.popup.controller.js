angular.module('www').controller('SignUpPopupController', SignUpPopupController);

SignUpPopupController.$inject = ['$uibModalInstance', 'position', 'data', 'Restangular', 'callback'];

function SignUpPopupController($uibModalInstance, position, data, Restangular, callback) {
    var vm = this;
    vm.close = close;

    vm.position = position;
    vm.data = data;
    vm.signUp = signUp;

    function close() {
        $uibModalInstance.dismiss();
    }

    function signUp() {
        vm.loading = true;
        Restangular.all('slots/sign-up').post(vm.data).then(signUpSuccess, signUpFailed)
    }

    function signUpSuccess(data) {
        vm.loading = false;
        if (data.error) {
            vm.error = data.data.error;
        } else {
            callback();
            vm.reserved = true;
            vm.reservation_number = data.data.reservation_number;
            Materialize.toast('Termin został zarezerwowany.', 2000);
        }
    }

    function signUpFailed(data) {
        vm.loading = false;
        vm.error = data.data.message || 'Wystąpił błąd. Prosze spróbowac ponownie później.'
    }
}