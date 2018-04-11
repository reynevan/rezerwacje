<?php

namespace App\Http\Controllers;

use App\Http\Response;
use App\Position;
use App\WorkingHour;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PositionsController extends Controller
{
    public function index()
    {
        $positionsAll = Position::with('users')->get();
        $positions = [];
        foreach ($positionsAll as $position) {
            $hours = [];
            $workingHours = WorkingHour::where('position_id', $position->id)->get();
            foreach ($workingHours as $wh) {
                $wh->formatTime();
                $wh->open = boolval($wh->open);
                $hours[$wh->day] = $wh;
            }
            $position['working_hours'] = $hours;
            if (count($workingHours)) {
                $positions[] = $position;
            }
        }
        return Response::success(compact('positions'));
    }
}
