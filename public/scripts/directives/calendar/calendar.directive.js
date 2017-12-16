(function () {

    'use strict';

    angular.module('www').directive('calendar', calendar);

    function calendar() {
        return {
            scope: {
                'clickSlot': '=',
                'loading': '=',
                'loadSchedule': '=',
                'slotTimes': '=',
                'selectedWeek': '=',
                'selectedYear': '=',
                'schedule': '='
            },
            controller: calendarController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'scripts/directives/calendar/calendar.html'
        };
    }

    calendarController.$inject = ['Utils'];

    function calendarController(Utils) {
        var vm = this;


        vm.PREVIOUS = -1;
        vm.TODAY = 0;
        vm.NEXT = 1;

        vm.VIEW_MODE_WEEK = false;
        vm.VIEW_MODE_DAY = true;

        var WEEKS_IN_YEAR = 52;
        var DAYS_IN_WEEK = 7;

        vm.viewMode = vm.VIEW_MODE_WEEK;

        vm.schedule = [];

        vm.$onInit = init;

        vm.changeSelectedDate = changeSelectedDate;
        vm.getWeekDay = getWeekDay;
        vm.getDate = getDate;
        vm.range = Utils.range;
        vm.isSlotOpen = isSlotOpen;
        vm.isSlotFree = isSlotFree;
        vm.isMyReservation = isMyReservation;
        vm.changeToWeekView = changeToWeekView;
        vm.changeToDayView = changeToDayView;
        vm.isFullHour = function (hour) {
            return hour.split(':')[1] == '00';
        };
        vm.showTodayButton = showTodayButton;

        function init() {
            selectToday();
        }

        function showTodayButton() {
            var weekly = vm.viewMode === vm.VIEW_MODE_WEEK && vm.selectedWeek !== moment().week();
            var daily = vm.viewMode === vm.VIEW_MODE_DAY && (vm.selectedWeek !== moment().week() || vm.selectedDay !== moment().isoWeekday());
            return weekly || daily;
        }

        function changeSelectedDate(direction) {

            var weekChange = false;

            switch (direction) {
                case vm.TODAY:
                    selectToday();
                    weekChange = true;
                    break;
                case vm.PREVIOUS:
                    if (vm.viewMode === vm.VIEW_MODE_WEEK) {
                        vm.selectedWeek--;
                        weekChange = true;
                    } else if (vm.viewMode === vm.VIEW_MODE_DAY) {
                        vm.selectedDay--;
                    }
                    break;
                case vm.NEXT:
                    if (vm.viewMode === vm.VIEW_MODE_WEEK) {
                        vm.selectedWeek++;
                        weekChange = true;
                    } else if (vm.viewMode === vm.VIEW_MODE_DAY) {
                        vm.selectedDay++;
                    }
                    break;
            }

            if (vm.selectedDay < 1) {
                vm.selectedDay = DAYS_IN_WEEK;
                vm.selectedWeek--;
                weekChange = true;
            } else if (vm.selectedDay > DAYS_IN_WEEK) {
                vm.selectedDay = 1;
                vm.selectedWeek++;
                weekChange = true;
            }

            if (vm.selectedWeek < 1) {
                vm.selectedWeek = WEEKS_IN_YEAR;
                vm.selectedYear--;
            } else if (vm.selectedWeek > WEEKS_IN_YEAR) {
                vm.selectedWeek = 1;
                vm.selectedYear++;
            }

            if (weekChange) {
                vm.loading = true;
                vm.loadSchedule(vm.selectedWeek, vm.selectedYear);
            }
        }

        function selectToday() {
            vm.selectedDay = moment().isoWeekday();
            vm.selectedWeek = moment().week();
            vm.selectedYear = moment().year();
        }

        function getWeekDay(i, format) {
            format = format || 'dddd';
            return moment().isoWeekday(i).format(format);
        }

        function getDate(i, format) {
            format = format || 'D MMMM';
            return moment().year(vm.selectedYear).week(vm.selectedWeek).isoWeekday(i).format(format);
        }


        function isSlotFree(day, index) {
            return vm.schedule[day][index].free;
        }

        function isSlotOpen(day, index) {
            return vm.schedule[day][index].open;
        }

        function isReservable(day, index, slot) {
            var now = moment();
            var futureWeek = vm.selectedWeek >= now.week();
            var currentWeek = vm.selectedWeek === now.week();
            var futureDay = day >= now.isoWeekday();
            var futureDay = futureWeek || (currentWeek && futureDay);
            var futureHour = slot.time >= now.format('HH:mm');
            return futureDay && futureWeek && vm.schedule[day][index].open;
        }

        function isMyReservation(day, index) {
            return vm.schedule[day][index].my;
        }

        function changeToWeekView() {
            vm.viewMode = vm.VIEW_MODE_WEEK;
        }

        function changeToDayView() {
            vm.viewMode = vm.VIEW_MODE_DAY;
        }
    }
})();