<?php

namespace App\Http\Controllers;

use App\Http\Response;
use App\Settings;
use App\Stand;
use App\User;
use App\WorkingHour;
use Illuminate\Http\Request;
use Validator;
use Hash;
use Mail;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
        $this->middleware('role.admin');
    }

    public function saveSettings(Request $request)
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
        return Response::success();
    }

    public function viewSettings()
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

    public function viewEmployees()
    {
        $employees = User::getEmployees();

        return Response::success(compact('employees'));
    }

    public function addEmployee(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'email|required|unique:users'
        ]);

        if ($validator->fails()) {
            return Response::validationError($validator->errors());
        }

        $data = $request->all();
        $data['role'] = User::ROLE_STAND_EMPLOYEE;
        $password = str_random(12);
        $data['password'] = Hash::make($password);
        $user = User::create($data);

        Mail::send('emails.new-employee', compact('user', 'password'), function ($m) use ($user) {
            $m->from('hello@app.com', 'Your Application');

            $m->to($user->email, $user->first_name)->subject('Your Reminder!');
        });

        return Response::success(compact('user'));
    }

    public function removeEmployee($userId)
    {
        User::destroy($userId);
        return Response::success();
    }

    public function editEmployee(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'email|required|unique:users,email,'.$userId
        ]);


        if ($validator->fails()) {
            return Response::validationError($validator->errors());
        }


        $user = User::where('id', $userId)->first();
        if (!$user) {
            return Response::notFound(trans('messages.not_found', ['item' => trans('models.user')]));
        }

        $user->update($request->only(['first_name', 'last_name', 'email']));
        $user->save();

        return Response::success();
    }

    private function validateTime($time)
    {
        return preg_match("/(2[0-3]|[01][0-9]):([0-5][0-9])/", $time);
    }
}
