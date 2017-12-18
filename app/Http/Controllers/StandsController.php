<?php

namespace App\Http\Controllers;

use App\Http\Response;
use App\Position;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class StandsController extends Controller
{
    public function index()
    {
        $stands = Position::with('users')->get();
        return Response::success(compact('stands'));
    }
}
