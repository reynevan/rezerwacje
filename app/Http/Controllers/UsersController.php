<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use Hash;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    public function myProfile()
    {
        $user = JWTAuth::parseToken()->authenticate();

        return [
            'user' => $user
        ];
    }

    public function edit(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'index_number' => 'required',
            'email' => 'email|required|unique:users,email,'.$user->id
        ]);



        $passwordChange = $request->get('old_password') || $request->get('password');
        if ($passwordChange && !Hash::check($request->get('old_password'), $user->password)) {
            $validator->after(function($validator) {
                $validator->errors()->add('old_password', trans('messages.incorrect_password'));
            });
        }


        if ($validator->fails()) {
            return [
                'errors' => $validator->errors()
                ];
        }


        $user->update($request->all());
        $user->save();

        return [
            'user' => $user
        ];
    }
}
