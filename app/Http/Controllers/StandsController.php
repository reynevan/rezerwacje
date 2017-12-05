<?php

namespace App\Http\Controllers;

use App\Stand;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class StandsController extends Controller
{
    public function index()
    {
        return ['stands' => Stand::with('user')->get()];
    }
}
