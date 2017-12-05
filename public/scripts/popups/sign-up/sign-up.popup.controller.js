angular.module('www').controller('SignUpPopupController', SignUpPopupController);

SignUpPopupController.$inject = ['$uibModalInstance', 'stand', 'data', 'Restangular', 'callback'];

function SignUpPopupController($uibModalInstance, stand, data, Restangular, callback) {
    var vm = this;
    vm.close = close;

    vm.stand = stand;
    vm.data = data;
    vm.signUp = signUp;

    function close() {
        $uibModalInstance.dismiss();
    }

    function signUp() {
        Restangular.all('alots/sign-up').post(vm.data).then(signUpSuccess, signUpFailed)
    }

    function signUpSuccess(data) {
        if (data.error) {
            vm.error = data.error;
        } else {
            console.log(data)
            callback();
            vm.reserved = true;
            vm.reservation_number = data.reservation_number;
            Materialize.toast('Termin został zarezerwowany.', 2000);
        }
    }

    function signUpFailed(data) {
        vm.error = data.error || 'Wystąpił błąd. Prosze spróbowac ponownie później.'
    }
}