<?php

namespace App\Http\Controllers;

use App\Http\Response;
use App\Position;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PositionsController extends Controller
{
    public function index()
    {
        $positions = Position::with('users')->get();
        return Response::success(compact('positions'));
    }
}
