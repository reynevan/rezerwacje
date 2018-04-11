<?php

namespace App\Http\Controllers;

use App\Http\Response;
use App\PositionsUser;
use App\Settings;
use App\Position;
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

        foreach ($employees as $employee) {
            $positions = Position::all();
            foreach ($positions as $position) {
                $position->setAttribute('checked', $employee->doesBelongTo($position));
            }
            $employee->setAttribute('positions', $positions);
        }
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
        $data['role'] = User::ROLE_POSITION_EMPLOYEE;
        $password = str_random(12);
        $data['password'] = Hash::make($password);
        $user = User::create($data);

        foreach ($request->get('positions') as $position) {
            if (isset($position['checked']) && $position['checked'] && $position['id']) {
                PositionsUser::create(['user_id' => $user->id, 'position_id' => $position['id']]);
            }
        }

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

        PositionsUser::where('user_id', $userId)->delete();
        foreach ($request->get('positions') as $position) {
            if (isset($position['checked']) && $position['checked'] && $position['id']) {
                PositionsUser::create(['user_id' => $userId, 'position_id' => $position['id']]);
            }
        }

        $user->update($request->only(['first_name', 'last_name', 'email']));
        $user->save();

        return Response::success();
    }

    public function viewPositions()
    {
        $positions = Position::with('users')->get();

        return Response::success(compact('positions'));
    }

    public function createPosition(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return Response::validationError($validator->errors());
        }

        $data = $request->all();
        $position = Position::create($data);

        $workingHours = $request->get('working_hours');
        if (is_array($workingHours)) {
            foreach ($workingHours as $day => $workingHour) {
                $validStart = isset($workingHour['start']) && $this->validateTime($workingHour['start']);
                $validEnd = isset($workingHour['end']) && $this->validateTime($workingHour['end']);
                $validDay = $day > 0 && $day <= 7;
                if ($validEnd && $validStart && $validDay) {
                    $workingHour = array_merge(['day' => $day], $workingHour);
                    $workingHour['position_id'] = $position->id;
                    WorkingHour::create($workingHour);
                }
            }
        }

        return Response::success(compact('position'));
    }

    public function editPosition(Request $request, $positionId)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);


        if ($validator->fails()) {
            return Response::validationError($validator->errors());
        }


        $position = Position::where('id', $positionId)->first();
        if (!$position) {
            return Response::notFound(trans('messages.not_found_neutral', ['item' => trans('models.position')]));
        }

        WorkingHour::where('position_id', $positionId)->delete();
        $workingHours = $request->get('working_hours');
        if (is_array($workingHours)) {
            foreach ($workingHours as $day => $workingHour) {
                if (isset($workingHour['start']) && isset($workingHour['start']['hour']) && isset($workingHour['start']['minute'])) {
                    $workingHour['start'] = $workingHour['start']['hour'] . ':' . $workingHour['start']['minute'];
                }
                if (isset($workingHour['end']) && isset($workingHour['end']['hour']) && isset($workingHour['end']['minute'])) {
                    $workingHour['end'] = $workingHour['end']['hour'] . ':' . $workingHour['end']['minute'];
                }
                $validStart = isset($workingHour['start']) && $this->validateTime($workingHour['start']);
                $validEnd = isset($workingHour['end']) && $this->validateTime($workingHour['end']);
                $validDay = $day > 0 && $day <= 7;
                if ($validEnd && $validStart && $validDay) {
                    $workingHour = array_merge(['day' => $day], $workingHour);
                    $workingHour['position_id'] = $positionId;
                    WorkingHour::create($workingHour);
                }
            }
        }

        $position->update($request->only(['name', 'description']));
        $position->save();

        return Response::success();
    }

    public function removePosition($id)
    {
        Position::destroy($id);
        return Response::success();
    }

    public function viewUsers(Request $request)
    {
        $users = User::where('role', User::ROLE_STUDENT)
            ->where(function($query) use ($request){
                if ($request->get('q')) {
                    $keywords = explode(' ', $request->get('q'));
                    foreach ($keywords as $i => $keyword) {
                        $keyword = '%'.$keyword.'%';
                        if ($i === 0) {
                            $query->where('first_name', 'like', $keyword);
                        } else {
                            $query->orWhere('first_name', 'like', $keyword);
                        }
                        $query
                            ->orWhere('last_name', 'like', $keyword)
                            ->orWhere('email', 'like', $keyword)
                            ->orWhere('index_number', 'like', $keyword);
                    }
                }
            })
            ->orderBy('last_name', 'asc')->get();

        return Response::success(compact('users'));
    }

    public function removeUser($id)
    {
        User::destroy($id);
        return Response::success();
    }

    private function validateTime($time)
    {
        return preg_match("/(2[0-3]|[01][0-9]):([0-5][0-9])/", $time);
    }
}
