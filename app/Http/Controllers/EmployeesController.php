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
use App\Slot;

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

    public function getQueueForPosition(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $now = new \DateTime();
        $reservations = Slot::where('week', $now->format('W'))
            ->where('year', $now->format('Y'))
            ->where('day', $now->format('N'))
            ->where('closed', false)
            ->with('user')
            ->with('position')
            ->whereHas('position', function($query ) use ($user)
            {
                $query
                    ->with('users')
                    ->whereHas('users', function($query ) use ($user)
                    {
                        $query->where('users.id', $user->id);
                    });
            })
            ->orderBy('time', 'asc');
        if ($request->get('position_id')) {
            $reservations->where('position_id', $request->get('position_id'));
        }
        $reservations = $reservations
            ->get();

        foreach ($reservations as $reservation) {
            $reservation
                ->addActiveColumn()
                ->addReservationNumberColumn()
                ->formatTime();
        }

        return ['reservations' => $reservations];
    }
}
