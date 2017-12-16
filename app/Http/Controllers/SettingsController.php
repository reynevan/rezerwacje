<?php

namespace App\Http\Controllers;

use App\Settings;
use App\User;
use App\WorkingHour;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class SettingsController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
        $this->middleware('role.admin');
    }

    public function save(Request $request)
    {
        WorkingHour::truncate();
        $workingHours = $request->get('working_hours');
        if (is_array($workingHours)) {
            foreach ($workingHours as $day => $workingHour) {
                $validStart = isset($workingHour['start']) && $this->validateTime($workingHour['start']);
                $validEnd = isset($workingHour['end']) && $this->validateTime($workingHour['end']);
                $validDay = $day > 0 && $day <= 7;
                if ($validEnd && $validStart && $validDay) {
                    $workingHour = array_merge(['day' => $day], $workingHour);
                    WorkingHour::create($workingHour);
                }
            }
        }
        $slotLength = $request->get('slot_length');
        if ($slotLength && is_numeric($slotLength) && $slotLength > 0 ) {
            $settings = Settings::get();
            $settings->slot_length = $slotLength;
            $settings->save();
        }
    }

    public function view()
    {
        $settings = Settings::get()->toArray();
        $settings['working_hours'] = [];
        $workingHours = WorkingHour::all();
        foreach ($workingHours as $workingHour) {
            $workingHour->formatTime();
            $settings['working_hours'][$workingHour->day] = $workingHour;
        }

        return $settings;
    }

    private function validateTime($time)
    {
        return preg_match("/(2[0-3]|[01][0-9]):([0-5][0-9])/", $time);
    }
}
