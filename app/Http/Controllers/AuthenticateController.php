<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Http\Response;
use JWTAuth;
use JWTFactory;
use Validator;
use Hash;
use Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Mail\Message;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\User as User;

class AuthenticateController extends Controller
{

    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate', 'signUp', 'recoverPassword', 'resetPassword', 'verify']]);
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $request->get('email'))->first();
        if (!$user) {
            return Response::authError(trans('messages.login_error'));
        }
        if (!$user->active && $user->role !== User::ROLE_ADMIN) {
            return Response::error(trans('messages.account_not_verified'));
        }
        try {
            // verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials, ['role' => $user->role])) {
                return Response::authError(trans('messages.login_error'));
            }
        } catch (JWTException $e) {
            // something went wrong
            return Response::generalError();
        }

        // if no errors are encountered we can return a JWT
        return Response::success(compact('token'));
    }

    public function signUp(Request $request)
    {
        $verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.env('CAPTCHA_SECRET').'&response='.$request->get('g_recaptcha_response'));
        $responseData = json_decode($verifyResponse);

        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'index_number' => 'required',
            'email' => 'email|required|unique:users',
            'password' => 'required',
            'password_repeat' => 'required'
        ]);

        if ($request->get('password') !== $request->get('password_repeat')) {
            $validator->after(function($validator) {
                $validator->errors()->add('password', trans('messages.different_passwords'));
            });
        }

        if (!$responseData->success) {
            $validator->after(function($validator) {
                $validator->errors()->add('captcha', trans('messages.captcha_failed'));
            });
        }


        if ($validator->fails()) {
            return [
                'errors' => $validator->errors()
            ];
        }

        $activationCode = str_random(30);

        $data = $request->all();
        $data['password'] = Hash::make($data['password']);
        $data['role'] = User::ROLE_STUDENT;
        $data['active'] = false;
        $data['activation_token'] = $activationCode;

        $user = User::create($data);

        Mail::send('emails.welcome', compact('user', 'password', 'activationCode'), function ($m) use ($user) {
            $m->from('hello@app.com', 'Your Application');

            $m->to($user->email, $user->first_name)->subject('Welcome');
        });

        return ['user' => $user];
    }

    public function recoverPassword(Request $request)
    {
        $this->validate($request, ['email' => 'required|email']);

        $user = User::where('email', $request->get('email'))->first();

        if (!$user) {
            return Response::notFound(trans('messages.no_user_with_email', ['email' => $request->get('email')]));
        }

        Password::sendResetLink($request->only('email'), function (Message $message) {
            $message->subject('Link do zmiany hasła');
        });

        return Response::success([], trans('messages.change_pass_email_sent', ['email' => $request->get('email')]));
    }

    public function resetPassword(Request $request)
    {
        $this->validate($request, [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:6',
        ]);

        $credentials = $request->only(
            'email', 'password', 'password_confirmation', 'token'
        );

        $response = Password::reset($credentials, function ($user, $password) {
            $user->password = Hash::make($password);

            $user->save();
        });
    }

    public function verify(Request $request)
    {
        $this->validate($request, [
            'token' => 'required'
        ]);

        $user = User::where('activation_token', $request->get('token'))->first();

        if (!$user) {
            return Response::forbiddenError(trans('messages.invalid_token'));
        }
        $user->active = true;
        $user->save();

        return Response::success();
    }
}
