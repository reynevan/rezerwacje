<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTFactory;
use Validator;
use Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\User as User;

class AuthenticateController extends Controller
{

    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate', 'signUp']]);
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $request->get('email'))->first();
        if (!$user) {
            return response()->json(['error' => trans('messages.login_error')], 401);
        }
        try {
            // verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials, ['role' => $user->role])) {
                return response()->json(['error' => trans('messages.login_error')], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        // if no errors are encountered we can return a JWT
        return response()->json(['token' => $token]);
    }

    public function signUp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'index_number' => 'required',
            'email' => 'email|required',
            'password' => 'required',
            'password_repeat' => 'required'
        ]);

        if ($request->get('password') !== $request->get('password_repeat')) {
            $validator->after(function($validator) {
                $validator->errors()->add('password', trans('messages.different_passwords'));
            });
        }


        if ($validator->fails()) {
            return [
                'errors' => $validator->errors()
            ];
        }

        $data = $request->all();
        $data['password'] = Hash::make($data['password']);
        $data['role'] = User::ROLE_STUDENT;
        $user = User::create($data);
        $token = JWTAuth::attempt(['email' => $data['email'], 'password' => $request->get('password')], ['role' => $user->role]);
        return ['user' => $user, 'token' => $token];
    }
}
