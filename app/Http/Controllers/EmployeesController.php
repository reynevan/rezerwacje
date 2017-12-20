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
use JWTAuth;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class EmployeesController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
        $this->middleware('role.employee');
    }

    public function myPositions()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $positions = $user->positions;

        return Response::success(compact('positions'));
    }
}
